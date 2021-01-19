// import phải luôn ở trên cùng các khai báo
// import theo chuẩn es6
// import axios from 'axios';
// rồi sau đó mới tới const var [] = require cái gì đó
const Discord = require('discord.js');
const { searchconsole_v1 } = require('googleapis');
const { searchconsole } = require('googleapis/build/src/apis/searchconsole');
const client = new Discord.Client();
const Antispam = require('discord-anti-spam');
// import theo chuẩn es5 
var axios = require('axios');
const { result } = require('lodash');
new Discord.APIMessage(searchconsole);
// khai báo dữ liệu mẫu hay có sẵn thì cũng phải để
// trên cùng dưới import, const, var
const replies = [
  'tao là tay sai của mày chắc',
  'có cái cl ấy mà đòi chửi nhau',
  'thanh lịch lên đi con đĩ, chửi cl <:pxien:640101653214789642>'
] 
const cohaykhong  = [
  'Không ạ',
  'Có ạ',
  'Chắc chắn rồi ạ',
  'Em nghĩ là không'
]
// client.on ready phải luôn nằm trên
// mỗi sự kiện client.on thì chỉ có 1
// lắng nghe sự kiện sẵn sàng khi bot được kết nối và chạy
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
// cho nên mình mới phải rem lại
// các client.on message
// lắng nghe sự kiện khi có tin nhắn mới (kể cả bot gửi tin nhắn)
// Bot Anh Sú Chỉ Dạy: tao là tay sai của mày chắc
// bot tự thấy tin nhắn mới của bot
// async thì google sau
// query = '' để khởi tạo, nếu không truyền data vào thì mặc định query = ''
// -> gọi là set default
// giống như let/var query = ''
async function requestYoutubeAPI(query = '') {
  try {
    // nếu không có query thì cho return
    // để function không chạy mớ code phía dưới nữa
    // đỡ mệt
    if (!query || query === '') {
      return false
    }
    // có query thì mình request
    // q (query): giá trị để search
    // maxResults: như tên (tìm tối đa, ở đây là 10)
    // forContentOwner: để tìm video thôi (nó có thể trả về channel nữa)
    // token: tự hiểu
    let resultYoutubeAPI = await axios.get(encodeURI(`https://youtube.googleapis.com/youtube/v3/search?q='${query}'&maxResults=10&key=AIzaSyDkEyCOHa3q5cBHy4qEj7Q_ePTbZ3qIeEA`))
    // kiểm tra cho chắc ăn
    // ai biết nó trả về thứ gì khác nữa
    if (
      // .data là trả về của axios
      resultYoutubeAPI.data && 
      // .items là trả về của youtubeAPI
      resultYoutubeAPI.data.items && 
      // kiểm tra nếu .items là mảng/chuỗi/array
      Array.isArray(resultYoutubeAPI.data.items) && 
      // kiểm tra nếu .items có độ dài mảng/chuỗi/array lớn hơn 0 (là có kết quả)
      resultYoutubeAPI.data.items.length > 0
    ) {
      // làm cách ngu người vậy
      let [hasFoundFirstVideo, embedId] = [false, ''];
      // chạy vòng lặp để kiểm tra các phần tử
      resultYoutubeAPI.data.items.forEach(item => {
        // lấy id thuộc loại video đầu tiên
        if (!hasFoundFirstVideo && item.id && item.id.kind && item.id.kind === 'youtube#video') {
          hasFoundFirstVideo = true;
          embedId = item.id.videoId;
        }
      })
      if (!hasFoundFirstVideo) {
        return false
      }
      else {
        return embedId;
      }
    }
    else {
      return false
    }
  }
  catch(error) {
    console.log(error);
  }
}

async function requestGoogleAPI(query = '') {
  try {
    if (!query || query === '') {
      return false
    }
    let [cx, safe, searchType] = ['9c4705166f56773e8', 'off', 'image'];
    let resultGoogleAPI = await axios.get(encodeURI(`https://customsearch.googleapis.com/customsearch/v1?cx=${cx}&searchType=${searchType}&q=${query}&key=AIzaSyDkEyCOHa3q5cBHy4qEj7Q_ePTbZ3qIeEA`))
    if (
      resultGoogleAPI.data && 
      resultGoogleAPI.data.items && 
      Array.isArray(resultGoogleAPI.data.items)
      // resultGoogleAPI.data.items[0].link &&
      // Array.isArray(resultGoogleAPI.data.items[0].link)  
      
    ) {
      
      return  resultGoogleAPI.data.items[0].link
    }
    else {
      return false;
    }
  }
  catch(error) {
    console.log(error);
  }
}

// async thì google sau và await
client.on('message', async message => {
  console.log(`${message.channel.name}`);
  console.log(`${message.author.username}: ${message.content}`);
  // ví dụ: %img phung
  // phải tách nội dung từ sau %img
  // nghĩa là phải truyền phung vào query
  if (message.content.indexOf('.yt') === 0) {
    let fullString = message.content;
    let query = fullString.substring(3);
    // không có kết quả thì trả về false
    // có kết quả thì trả về videoId
    // trim để cắt đoạn trống/khoảng trắng dư thừa
    let embedId = await requestYoutubeAPI(query.trim());
    if (embedId) {
      // tạm thời thì vậy
      // reply với cái link youtube luôn
      message.channel.send(`https://www.youtube.com/watch?v=${embedId}`)

    }
  }

  if (message.content.indexOf('.img') === 0) {
    let fullString = message.content;
    let query = fullString.substring(3);
    let urlImage = await requestGoogleAPI(query.trim());
    console.log(urlImage);
   if (urlImage) {
      message.channel.send(urlImage);
   }
  }

  // chạy khi có người ghi 'chửi nó cho anh....' ở đầu câu
  if (message.content.indexOf('chửi nó cho anh') === 0){
    const index = Math.floor(Math.random()* replies.length);
    message.channel.send(replies[index])
  };
if (message.content.indexOf('có hay không')=== 0 ){
  const index = Math.floor(Math.random()* cohaykhong.length);
  message.channel.send(cohaykhong[index])
};
  // chạy khi có người ghi 'bot ngu....' ở đầu câu
  if(message.content.indexOf('bot ngu') === 0){
    message.channel.send('đang học code nên ngu là phải rồi');
  }

  // chạy khi có người ghi '%ava....' ở đầu câu
  // trả về avatar của chính người đó nếu không có ai được nhắc đến (tag/mention)
  if (message.content.indexOf('.ava') === 0) 
    if(message.mentions.users.first()) {
      let mentiondUser = message.mentions.users.first();
        if(mentiondUser.avatar){
         let user_id = mentiondUser.id,
             user_avatar = mentiondUser.avatar,
             avatarUrl = '';
             let isGifFormat = user_avatar.indexOf('a_') ===0;
         avatarUrl = `https://cdn.discordapp.com/avatars/${user_id}/${user_avatar}.${isGifFormat? 'gif' : 'png'}?size=2048`
        const avatarEmbed = new Discord.MessageEmbed()
        .setImage(avatarUrl)
        .setColor('#0099ff')
        .setDescription('Mặt tiền của nó đây ạ <:doge:428416714946904074>')
        message.channel.send(avatarEmbed);
      }
    }
    else{
      let user_id = message.author.id,
          user_avatar = message.author.avatar,
          avatarUrl = '';
        let isGifFormat = user_avatar.indexOf('a_') ===0;
         avatarUrl = `https://cdn.discordapp.com/avatars/${user_id}/${user_avatar}.${isGifFormat? 'gif' : 'png'}?size=2048`  
     const avatarEmbed = new Discord.MessageEmbed()
       .setImage(avatarUrl)
        .setColor('#0099ff')
      .setDescription('Mặt tiền của nó đây ạ <:doge:428416714946904074>')
      message.channel.send(avatarEmbed);
    }    
  }
);

client.login('NzgzODc0MDE2OTgwNTAwNTIw.X8hFkQ.tiZAeFQRfpp5Vi9IsusbAmD1wjU');