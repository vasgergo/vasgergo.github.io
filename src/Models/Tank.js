export class Tank {

    constructor(x, y, team, type, direction, image, context) {
        this.x = x;
        this.y = y;

        this.type = type;
        this.team = team;
        this.direction = direction;
        this.context = context;
        this.img = image;

        this.width = undefined;
        this.height = undefined;
        this.health = undefined;
        this.fuel = undefined;
        this.consumption = undefined;
        this.damage = undefined;
        this.roationSpeed = undefined;
        this.roationSpeed = undefined;

        switch (this.type) {
            case 'light':
                this.width = 30;
                this.height = 30;
                this.health = 10;
                this.fuel = 500;
                this.consumption = 20;
                this.damage = 10;
                this.speed = 1;
                this.roationSpeed = 5;
                break;
            case 'medium':
                this.width = 45;
                this.height = 45;
                this.health = 10;
                this.fuel = 100;
                this.consumption = 30;
                this.damage = 30;
                this.speed = 1;
                this.roationSpeed = 2;
                break;
            case 'heavy':
                this.width = 60;
                this.height = 60;
                this.health = 10;
                this.fuel = 150;
                this.consumption = 40;
                this.damage = 50;
                this.speed = 1;
                this.roationSpeed = 1;
                break;
        }

        this.img.width = this.width;
        this.img.height = this.height;


        this.aimParams = {
            p1: 70,
            p2: 25,
        }



        this.angle = 0;
        switch (this.direction) {
            case 'up':
                this.angle = 0;
                break;
            case 'right':
                this.angle = 90;
                break;
            case 'down':
                this.angle = 180;
                break;
            case 'left':
                this.angle = 270;
                break;
        }

        this.aimFunction;

        this.isCrashed = false;
    }

    rotationAnimation(destinationAngle, updateFrame, callback) {
        this.angle = this.angle % 360;

        if (this.angle === destinationAngle) {
            callback();
            return;
        }
        let rotationDirection = ((destinationAngle - this.angle + 360) % 360 > 180) ? -1 : 1;

        let interval = setInterval(() => {
            this.angle += rotationDirection * this.roationSpeed
            this.angle = this.angle % 360;
            if (this.angle < 0) {
                this.angle += 360;
            }

            updateFrame();
            if (this.angle === destinationAngle) {
                console.log('clear');
                clearInterval(interval);
                callback();
            }
        }, 20);

    }

    move(direction, allFences, allTanks, allHeals, allFuels, canvas) {
        let x = 0;
        let y = 0;
        if (this.fuel <= 0) {
            console.log('No fuel');
            return;
        }

        switch (direction) {
            case 'up':
                y = -1 * this.speed;
                break;
            case 'down':
                y = this.speed;
                break;
            case 'left':
                x = -1 * this.speed;
                break;
            case 'right':
                x = this.speed;
                break;
        }

        let tankClone = new Tank(this.x + x, this.y + y, this.team, this.type, this.direction, this.img, this.context)


        //check if it is out of canvas
        if (tankClone.x < 0 || tankClone.x > canvas.width - tankClone.width || tankClone.y < 0 || tankClone.y > canvas.height - tankClone.height) {
            console.log('Canvas');
            return;
        }


        //check if there is a heal in the way
        for (let i = 0; i < allHeals.length; i++) {
            if (allHeals[i].isOverlap(tankClone)) {
                this.health += allHeals[i].amount;

                //remove the from the array
                allHeals.splice(i, 1);
                break;
            }
        }

        //check if there is a fuel in the way
        for (let i = 0; i < allFuels.length; i++) {
            if (allFuels[i].isOverlap(tankClone)) {
                this.fuel += allFuels[i].amount;

                //remove the from the array
                allFuels.splice(i, 1);
                break;
            }
        }

        //check if there is a fence in the way
        for (let i = 0; i < allFences.length; i++) {
            if (allFences[i].isOverlap(tankClone)) {
                console.log('Fence');
                return;
            }
        }
        //check if there is a tank in the way
        for (let i = 0; i < allTanks.length; i++) {
            //do not check with itself
            if (allTanks[i] === this) {
                continue;
            }
            if (allTanks[i].isOverlap(tankClone)) {
                console.log('overlapping with: ', allTanks[i].team + ' ' + allTanks[i].type);
                return;
            }
        }

        //if there is no fence or tank then move
        this.x += x;
        this.y += y;
        this.fuel -= this.consumption / 100;
    }

    getDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            document.getElementById(this.team + '_' + this.type).style.backgroundColor = 'red';
            this.isCrashed = true;
        }
    }

    isOverlap(tank) {
        return this.x < tank.x + tank.width && this.x + this.width > tank.x && this.y < tank.y + tank.height && this.y + this.height > tank.y;
    }

    draw() {
        let angle = this.angle;
        this.context.save();
        this.context.translate(this.x + this.img.width / 2, this.y + this.img.height / 2);
        this.context.rotate(angle * Math.PI / 180);
        this.context.drawImage(this.img, -this.img.width / 2, -this.img.height / 2, this.img.width, this.img.height);
        this.context.restore();
    }
}
