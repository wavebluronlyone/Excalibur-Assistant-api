class Di {
	constructor() {
		this.dependency = {};

	}

	set(name, dependency) {
		this.dependency = {
			...this.dependency,
			[name]: dependency,
		};
	}

	get(name) {
		return this.dependency[`${name}`];
	}
}

module.exports = new Di();
