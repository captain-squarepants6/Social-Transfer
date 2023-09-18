const crypto = require('crypto');
const shortnerDb = require('../sql/shortner');
shortnerDb.sync()

function generateRandomString(length) {
    const bytes = Math.ceil(length / 2);
    return crypto.randomBytes(bytes).toString('hex').slice(0, length);
}

async function existShort(token){
    return Boolean(await shortnerDb.findOne({where:{token}}))
}
async function addShort(url){
    let token = generateRandomString(6)
    while(await existShort(token)){
        token = generateRandomString(6)
    }
    return await new Promise(async (resolve, reject) => {
        try {
            await shortnerDb.create({token,url})
            resolve(token)
        } catch (error) {
            reject(error)
        }
    })
}
async function removeShort(token){
    return await new Promise(async (resolve, reject) => {
        try {
            await shortnerDb.destroy({where:{token}})
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

async function getShort(token){
    const data = await shortnerDb.findOne({where:{token}})
    if(data){
        return data.dataValues.url
    }
    return false
}

module.exports = {
    generateRandomString,
    existShort,
    addShort,
    removeShort,
    getShort
}
