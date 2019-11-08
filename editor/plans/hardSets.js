const setsPlans = {
	start: {
		designer: 'devCrew',
		exits: {
			basicPlace: {
			},
		},
		desc: 'This place is declaired in config.js. It has an exit to Basic Place.',
	},
	basicPlace: {
		designer: 'devCrew',
		exits: {
			nextPlace: {
			},
		},
		desc: 'a basic place. It has a basic description, and a basic thing in it. You can pick the thing up if you like',
	},
	nextPlace: {
		desc: 'this room has two exits, one of them is a door. It leads to the Door Room.',
		designer: 'devCrew',
		exits: {
			doorRoom: {
			},
			basicPlace: {
			},
		},
	},
	doorRoom: {
		exits: {
			lockedDoor: {
				desc: 'This door is locked, you need a key',
				locked: 'true',
				key: 'doorKey',
			},
			nextPlace: {
			},
			hiddenDoor: {
				door: 'true',
				hidden: 'true',
				reveal: 'revealingKey',
			},
		},
	},
	lockedDoor: {
		exits: {
			doorRoom: {
			},
		},
		designer: 'devCrew',
		desc: 'Of course this should really be called Locked Room.',
	},
	hiddenDoor: {
		desc: 'Of course this should really be called Hidden Room.',
		designer: 'devCrew',
		exits: {
			doorRoom: {
			},
		},
		hidden: 'true',
	},
	test: {
	},
	boxRoom: {
		designer: 'devCrew',
	},
}