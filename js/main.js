var canvas = document.getElementById("game")
var ctx = canvas.getContext("2d")

var dt = 0
var lastUpdate = Date.now();
var myInterval = setInterval(tick, 0);

var game_objects = []

var enemy = {
	x: 600,
	y: 200,
	w: 32,
	h: 32,
	actions: [
		{y: 0, x: -1},
		{y: 0, x: 1},
		{y: -1, x: 0},
		{y: 1, x: 0}
	],
	move: function (y, x, dt) {
		var nx = this.x + x * this.v * dt
		var ny = this.y + y * this.v * dt
		nx = nx > map.w - this.w ? map.w - this.w : nx < 0 ? 0 : nx
		ny = ny > map.h - this.h ? map.h - this.h : ny < 0 ? 0 : ny
		if (map.blocks[map.grid[Math.floor(ny/this.h)][Math.floor(nx/this.w)]].walk &&
		map.blocks[map.grid[Math.floor((ny+this.h)/this.h)][Math.floor(nx/this.w)]].walk &&
		map.blocks[map.grid[Math.floor(ny/this.h)][Math.floor((nx+this.w)/this.w)]].walk &&
		map.blocks[map.grid[Math.floor((ny+this.h)/this.h)][Math.floor((nx+this.w)/this.w)]].walk) {
			this.x = nx
			this.y = ny
		}
	},
	draw: function () {
		ctx.fillStyle = "#f0f"
		ctx.fillRect(this.x, this.y, this.h, this.w)
	},
	update: function (dt) {
		var vm = this
		var rand = Math.floor(Math.random() * (4))
		var action = this.actions[rand]
		console.log(action.x, action.y, dt)
		vm.move(action.y, action.x, dt)
	}
}

var map = {
	x: 0,
	y: 0,
	w: 640,
	h: 320,
	bw: 32,
	bh: 32,
	blocks: {0: {color: "#000", walk: true}, 1: {color: "#f00", walk: false}, 2: {color: "#0f0", walk: true}, 3: {color: "#00f", walk: true}},
	grid: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 1, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	draw: function () {
		var vm = this
		vm.grid.forEach(function (e, i) {
			e.forEach(function (ee, ii) {
				ctx.fillStyle = vm.blocks[ee].color
				ctx.fillRect(ii*vm.bh, i*vm.bw, vm.bh, vm.bw)
			})
		})
	},
	update: function () {
	}
}
var player = {
	h: 32,
	w: 32,
	x: 10, 
	y: 10,
	v: 200,
	actions: {
		"ArrowLeft": {y: 0, x: -1},
		"ArrowRight": {y: 0, x: 1},
		"ArrowUp": {y: -1, x: 0},
		"ArrowDown": {y: 1, x: 0},
		"a": {y: 0, x: -1},
		"d": {y: 0, x: 1},
		"w": {y: -1, x: 0},
		"s": {y: 1, x: 0}
	},
	exec: [],
	listeners: function () {
		var vm = this
		window.addEventListener("keydown", function (ev) {
			if (vm.exec.indexOf(ev.key) < 0) {
				vm.exec.push(ev.key)
			}
		})
		window.addEventListener("keyup", function (ev) {
			vm.exec = vm.exec.filter(function (e, i) {
				return e != ev.key
			})
		})
	},
	draw: function () {
		ctx.fillStyle = "#fff"
		ctx.fillRect(this.x, this.y, this.h, this.w)
	},
	move: function (y, x, dt) {
		var nx = this.x + x * this.v * dt
		var ny = this.y + y * this.v * dt
		nx = nx > map.w - this.w ? map.w - this.w : nx < 0 ? 0 : nx
		ny = ny > map.h - this.h ? map.h - this.h : ny < 0 ? 0 : ny
		if (map.blocks[map.grid[Math.floor(ny/this.h)][Math.floor(nx/this.w)]].walk &&
		map.blocks[map.grid[Math.floor((ny+this.h)/this.h)][Math.floor(nx/this.w)]].walk &&
		map.blocks[map.grid[Math.floor(ny/this.h)][Math.floor((nx+this.w)/this.w)]].walk &&
		map.blocks[map.grid[Math.floor((ny+this.h)/this.h)][Math.floor((nx+this.w)/this.w)]].walk) {
			this.x = nx
			this.y = ny
		}
	},
	update: function (dt) {
		var vm = this
		vm.exec.forEach(function (e, i) {
			var movement = vm.actions[e]
			if(movement != undefined)
				vm.move(movement.y, movement.x, dt)
		})
	
	}
}
player.listeners();

game_objects.push(map)
game_objects.push(enemy)
game_objects.push(player)

function tick() {
    var now = Date.now();
    dt = (now - lastUpdate)/1000;
    lastUpdate = now;

    update(dt);
    render();
}

function render(){
	game_objects.forEach(function (e, i) {
		e.draw();
	})
}

function update(dt){
	game_objects.forEach(function (e, i) {
		e.update(dt);
	})
}
