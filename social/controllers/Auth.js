'use strict';
const FB = require('fb');
const config = () => { return strapi.plugins.social.config }
const { sanitizeEntity } = require('strapi-utils');
const axios = require('axios');


const facebookLogin = (access_token) => {
    return new Promise((resolve, reject) => {
        FB.options({
            version: 'v2.4',
            appId: config().FACEBOOK_ID,
            appSecret: config().FACEBOOK_SECRET
        });
        FB.setAccessToken(access_token);
        FB.api('me', { fields: ['id', 'name', 'email'] }, function (res) {
            if (!res || res.error) { reject(null); return; }
            resolve(res);
        });
    })
}


const googleLogin = (access_token) => {
    var config = {
        method: 'post',
        url: `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${access_token}`
    };

    return axios(config)
        .then(response => response.data)
        .catch(error => { console.log(error) });
}


const access = async (id, email, name) => {
    const account = await strapi.query('user', 'users-permissions').findOne({ social_id: id });
    if (account) return authorize(account);

    const role = await strapi.query('role', 'users-permissions').findOne({name: "Authenticated"});
    const newAcc = await strapi.query('user', 'users-permissions').create({
        role: role.id,
        confirmed: true,
        social_id: id,
        username: email,
        email: email,
        full_name: name
    });
    return authorize(newAcc);
}


const authorize = (account) => {
    return {
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
            id: account.id,
        }),
        user: sanitizeEntity(account.toJSON ? account.toJSON() : account, {
            model: strapi.query('user', 'users-permissions').model,
        })
    }
}


module.exports = {
    facebook: async (ctx) => {
        const { params: params, state: { user: user }, request: { body: body, query: query } } = ctx;
        if (!body.access_token) return ctx.badRequest("access_token é obrigatório no corpo da requisição.");
        const acc = await facebookLogin(body.access_token);
        if (!acc) return ctx.badRequest("Não foi possível realizar o login");
        if (!acc.email) acc.email = `${acc.id}@facebook.com`
        return access('facebook' + acc.id, acc.email, acc.name);
    },


    google: async (ctx) => {
        const { params: params, state: { user: user }, request: { body: body, query: query } } = ctx;
        if (!body.access_token) return ctx.badRequest("access_token é obrigatório no corpo da requisição.");
        const acc = await googleLogin(body.access_token);
        if (!acc) return ctx.badRequest("Não foi possível realizar o login");
        if (!acc.email) acc.email = `${acc.sub}@google.com`
        return access('google' + acc.sub, acc.email, acc.name);
    },
};