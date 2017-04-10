var canvas = document.getElementById("game")
var ctx = canvas.getContext("2d")

var dt = 0
var lastUpdate = Date.now();
var myInterval = setInterval(tick, 0);

var game_objects = []

var enemy_rand = {
	x: 600,
	y: 200,
	w: 32,
	h: 32,
	v: 200,
	lm: {y: 0, x: 1},
	actions: [
		{y: 0, x: -1},
		{y: 0, x: 1},
		{y: -1, x: 0},
		{y: 1, x: 0}
	],
	move: function (y, x, dt) {
		var nx = this.x + x * this.v * dt
		var ny = this.y + y * this.v * dt
		var tile = [
			{x: Math.floor(nx/this.w), y: Math.floor( ny/this.h)},
			{x: Math.floor((nx+this.w)/this.w), y: Math.floor(ny/this.h)},
			{x: Math.floor(nx/this.w), y: Math.floor((ny+this.h)/this.h)},
			{x: Math.floor((nx+this.w)/this.w), y: Math.floor((ny+this.h)/this.h)}
		]
		var valid = true
		tile.forEach(function (e, i) {
			if(e.x < 0 || e.y < 0 || e.x > map.w/map.bw - 1 || e.y > map.h/map.bh - 1){
				valid = false
			}
		})
		if (valid && map.blocks[map.grid[Math.floor(ny/this.h)][Math.floor(nx/this.w)]].walk &&
		map.blocks[map.grid[Math.floor((ny+this.h)/this.h)][Math.floor(nx/this.w)]].walk &&
		map.blocks[map.grid[Math.floor(ny/this.h)][Math.floor((nx+this.w)/this.w)]].walk &&
		map.blocks[map.grid[Math.floor((ny+this.h)/this.h)][Math.floor((nx+this.w)/this.w)]].walk) {
			this.x = nx
			this.y = ny
		}else{
			this.change_dir()
		}
	},
	draw: function () {
		ctx.fillStyle = "#f0f"
		ctx.fillRect(this.x, this.y, this.h, this.w)
	},
	update: function (dt) {
		var vm = this
		var dec = Math.floor(Math.random() * 1000)
		if (dec > 998) {
			vm.change_dir()
		}
		vm.move(vm.lm.y, vm.lm.x, dt)
	},
	change_dir: function () {
		var vm = this
		var rand = Math.floor(Math.random() * (3))
		var action = this.actions[rand]
		if (vm.lm.x == action.x && vm.lm.y == action.y) {
			rand = rand == 3 ? rand - 1 : rand + 1
			action = this.actions[rand]
		}
		console.log('rand', rand)
		vm.lm = action
		console.log(vm.lm)
	}
}

var enemy_pf = {
	x: 600,
	y: 200,
	w: 32,
	h: 32,
	v: 200,
	draw: function () {},
	update: function (dt) {

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
	},
	pathfinding: function (i, f) {
		var vm = this
		var queue = [{y: i.y, x: i.x, i: 0}]
		var end = false
		var idx = 0

		var grid = [[]]

		for (var i = 0; i < vm.grid.length; i++) {
			grid[i] = []
			for (var j = 0; j < vm.grid[i].length; j++) {
				grid[i][j] = vm.grid[i][j]
			}
		}

		grid[f.y][f.x] = 'f'

		console.log(grid)

		while (!end) {
			idx += 1
			queue.forEach(function (qe, qi) {
				var sur = [
					{y: qe.y+1, x: qe.x, i: idx},
					{y: qe.y, x: qe.x+1, i: idx},
					{y: qe.y-1, x: qe.x, i: idx},
					{y: qe.y, x: qe.x-1, i: idx},
				]
				sur.forEach(function (e, i) {
					var similar = queue.filter(function (el, id) {
						return el.x == e.x && el.y == e.y
					})
					console.log(similar.length)
					
					if (grid[e.y] && grid[e.y][e.x] && grid[e.y][e.x] == 0 && similar.length == 0) {
						queue.push(e)
						grid[e.y][e.x] = String(e.i)
					}
					if (grid[e.y][e.x] == 'f') {
						end = true
					}
				})
			})
		}

		console.log(queue)
	}
}
map.pathfinding({x: 5, y: 7},  {x: 7, y: 8})

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
		var tile = [
			{x: Math.floor(nx/this.w), y: Math.floor( ny/this.h)},
			{x: Math.floor((nx+this.w)/this.w), y: Math.floor(ny/this.h)},
			{x: Math.floor(nx/this.w), y: Math.floor((ny+this.h)/this.h)},
			{x: Math.floor((nx+this.w)/this.w), y: Math.floor((ny+this.h)/this.h)}
		]
		var valid = true
		tile.forEach(function (e, i) {
			if(e.x < 0 || e.y < 0 || e.x > map.w/map.bw - 1 || e.y > map.h/map.bh - 1){
				valid = false
				console.log(e.x, e.y)
			}
		})
		if (valid && map.blocks[map.grid[Math.floor(ny/this.h)][Math.floor(nx/this.w)]].walk &&
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
