const canvasEl = document.getElementById("pingpongCanvas");
const canvasCtx = canvasEl.getContext("2d");
const gapX = 10;

const mouse = { x: 0, y: 0 }

const lineWidth = 15;

function startGame(difficulty) {
    // Configurar o jogo com base na dificuldade escolhida
    alert('Iniciando o jogo com dificuldade: ' + difficulty);

    // Por exemplo, você pode ajustar a velocidade da bola, a velocidade da raquete, etc.
    if (difficulty === 'easy') {
        ball.speed = 3;
        rightPaddle.speed = 4;
    } else if (difficulty === 'medium') {
        ball.speed = 5;
        rightPaddle.speed = 5;
    } else if (difficulty === 'hard') {
        ball.speed = 7;
        rightPaddle.speed = 6;
    }

}


const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function () {
        canvasCtx.fillStyle = "#286047";
        canvasCtx.fillRect(0, 0, this.w, this.h);
    },
};

const line = {
    w: 15,
    h: field.h,
    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
    },
};

const leftPaddle = {
    x: gapX,
    y: 100,
    w: lineWidth,
    h: 200,
    _move: function () {
        this.y = mouse.y - this.h / 2
    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);

        this._move()
    },
};

const rightPaddle = {
    x: field.w - lineWidth - gapX,
    y: 0,
    w: lineWidth,
    h: 200,
    speed: 5,
    _move: function () {
      if (this.y + this.h / 2 < ball.y + ball.radius) {
        this.y += this.speed
      } else {
        this.y -= this.speed
      } 
    },
    _speedUp: function() {
        this.speed += 2
    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);

        this._move()
    },
};

const score = {
    human: 0,
    computer: 0,
    increaseHuman: function () {
        this.human++;
        if (this.human === 10) {
            alert("Parabéns! Você venceu o jogo!");
            this.reset();
        }
    },
    increaseComputer: function () {
        this.computer++;
        if (this.computer === 10) {
            alert("O computador venceu! Tente novamente.");
            this.reset();
        }
    },
    reset: function () {
        this.human = 0;
        this.computer = 0;
        ball.speed = 2; // Reinicia a velocidade da bola
        rightPaddle.speed = 5; // Reinicia a velocidade da raquete direita
        ball.x = field.w / 2;
        ball.y = field.h / 2;
    },
    draw: function () {
        canvasCtx.font = "bold 72px Arial";
        canvasCtx.textAlign = 'center';
        canvasCtx.textBaseline = "top";
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillText(this.human, field.w / 4, 50);
        canvasCtx.fillText(this.computer, field.w / 4 + window.innerWidth / 2, 50);
    }
};


const ball = {
    x: 0,
    y: 0,
    radius: 30,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function () {

        if (
            this.x > field.w - this.radius - rightPaddle.w - gapX) {
            // verifica se a raquete direita está na posição y da bola
            if (this.y + this.radius > rightPaddle.y &&
                this.y - this.radius < rightPaddle.y + rightPaddle.h
                
            ) {
                // rebate a bola invertendo o sinal de x 
                this._reverseX()
            } else {
                // pontuar o jogador 1  
                score.increaseHuman()
                this._pointUp()
            }
            

        }
        // verifica se o jogador 2 fez um ponto (x < 0)
        if (this.x < this.radius + leftPaddle.w + gapX) {

            //verifica se a raquete esquerda está na posição y da bola
            if (this.y + this.radius > leftPaddle.y && this.y - this.radius < leftPaddle.y + leftPaddle.h
            ) {
                //rebate a bola invertendo o sinal de x
                this._reverseX()
            } else {
                // pontuar computador
                score.increaseComputer()
                this._pointUp()
            }
        }

        // verifica as laterais superior e inferior do campo
        if (
            (this.y - this.radius < 0 && this.directionY < 0) ||
            (this.y > field.h - this.radius && this.directionY > 0)
        ) {
            this._reverseY()
        }

        // rebate a bola invertendo o sinal do eixo Y
    },
    _reverseX: function () {
        this.directionX *= -1
    },
    _reverseY: function () {
        this.directionY *= -1
    },
    _speedUp: function() {
     this.speed += 2
    },
    _pointUp: function () {
        this._speedUp()
        rightPaddle._speedUp()

        this.x = field.w / 2
        this.y = field.h / 2


    },
    _move: function () {
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },
    draw: function () {
        canvasCtx.beginPath();
        canvasCtx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        canvasCtx.fill();

        this._calcPosition()
        this._move()
    },
};

function setup() {
    canvasEl.width = canvasCtx.width = field.w;
    canvasEl.height = canvasCtx.height = field.h;
}

function draw() {
    field.draw();
    line.draw();
    leftPaddle.draw();
    rightPaddle.draw();
    ball.draw();
    score.draw();
}

window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    draw()
}

setup()
main()

canvasEl.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX
    mouse.y = e.pageY

})

window.setInterval(draw, 1000 / 60)

// canvasCtx.font = "bold 72px Arial"
//canvasCtx.textAlign = 'center'
//canvasCtx.textBaseline = "top"
//canvasCtx.fillStyle = "#01341D"
//canvasCtx.fillText("3", window.innerWidth / 4, 50)
//canvasCtx.fillText("1", window.innerWidth / 4 + window.innerWidth / 2, 50)


