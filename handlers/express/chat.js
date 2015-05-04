module.exports = function chatController(req, res) {
	//console.log(req.partner);
	// req.partner = { _id: '53de7a6af709cda0478959ba55295302f223b3e43710c7c1',
 //  closed: false,
 //  common_friend_count: 0,
 //  common_like_count: 0,
 //  created_date: '2015-04-18T16:18:33.245Z',
 //  dead: false,
 //  last_activity_date: '2015-04-18T21:15:59.359Z',
 //  message_count: 0,
 //  messages: 
 //   [ { _id: '5532c98ff6e865b875c8be4b',
 //       match_id: '53de7a6af709cda0478959ba55295302f223b3e43710c7c1',
 //       to: '55295302f223b3e43710c7c1',
 //       from: '53de7a6af709cda0478959ba',
 //       message: 'I\'m confused',
 //       sent_date: '2015-04-18T21:15:59.359Z',
 //       created_date: '2015-04-18T21:15:59.359Z',
 //       timestamp: 1429391759359 } ],
 //  participants: [ '53de7a6af709cda0478959ba' ],
 //  pending: false,
 //  following: true,
 //  following_moments: true,
 //  id: '53de7a6af709cda0478959ba55295302f223b3e43710c7c1',
 //  person: 
 //   { _id: '53de7a6af709cda0478959ba',
 //     bio: 'This is difficult to fill.   ',
 //     birth_date: '1992-12-02T00:00:00.000Z',
 //     gender: 0,
 //     name: 'Jonathan',
 //     ping_time: '2015-04-18T16:16:45.246Z',
 //     photos: [ [Object], [Object] ] } }
 console.log('using partner',req.partner);
	res.render('chat', { partner: req.partner, messages: JSON.stringify(req.partner.messages) })
}	