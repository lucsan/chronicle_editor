const propsPlans = {
	basicThing: {
		artist: 'devCrew',
		desc: 'a basic thing, it really doesnt do very much',
		locs: ['basicPlace'],
		pickUp: true,
	},
	testp: {
		artist: 'devCrew',
	},
	doorKey: {
		artist: 'devCrew',
		desc: 'Its a key, for a door, you need to hold it to use it.',
		locs: ['doorRoom'],
		pickUp: true,
	},
	revealingKey: {
		artist: 'devCrew',
		locs: ['doorRoom'],
		pickUp: true,
		reveals: ['hiddenDoor'],
	},
}