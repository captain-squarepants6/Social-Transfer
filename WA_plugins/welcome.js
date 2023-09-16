const {welcomeDb, addwelcome ,updatewelcome,deletewelcome} = require("./sql/welcome")
const { Module,onMessage } = require('../WA_index');
const { name } = require("./classroom-notification");

Module({ pattern: 'welcome', fromMe: true, desc: 'Welcome message setter', use: 'utility' }, async (m,match) => {
    if(!match[1]) return await m.send("Give me a welcome message")
    this.text = match[1]
    if(match[1]=="del"){
        this.state = "delete"
        let data = (await welcomeDb.findAll())
        let msg =''
        let n = 1
        arr = {}
        for(let i of data){
            msg += `${n}. ${(await m.client.groupMetadata(i.name)).subject}\n`
            arr[n]=i.name
            n++
        }
        this.data = arr
        let a = await m.send(msg)
        this.id = a.key.id
        return 0;
    }else{
    let groups = Object.keys(await m.client.groupFetchAllParticipating())
    if (!groups.length) return await m.sendReply("_No group chats!_");
    let msg = ""
    let n = 1
    let data = {}
    for (let e of groups){
        try {
    let g_name = (await m.client.groupMetadata(e)).subject
    msg+= `${n}. ${g_name}\n\n`
    data[n] = e
    n++
    } catch {let g_name = 'Can\'t load name (rate-overlimit)'}
    }
    this.data = data
    let a = await m.send(msg)
    this.id = a.key.id
    this.state = true
    return 0;
    }
})

onMessage({ pattern: 'message', fromMe: false, desc: 'welcome message setter', use: 'utility' }, async (m,match) => {
    if(m.quoted?.id == this.id && this.state && !m.message.match("welcome")){
        await welcomeDb.sync()
        if(m.message == "stop"){
            this.state = false
            return 0;
        }
        else{

            var no = /\d+/.test(m.message) ? m.message.match(/\d+/)[0] : false
            if (!no) throw "_Reply must be  a number_";
            let jid = this.data[no]
            if(this.state == "delete"){
                await deletewelcome(jid)
                this.state = false
                return await m.send("welcome message deleted")
            }
            await addwelcome(jid,this.text)
            this.state = false
            return await m.send("welcome message set.")
        }
    }
    else{
        return 0;
    }

})