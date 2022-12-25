var 
    width       = 500;
    height      = 500;

    cnv         = document.getElementById('canvas');
    ctx         = cnv.getContext('2d');

    dots        = [];
    isStarted   = false;
    isRunning   = false;
    generations = 0;
    cooldown    = 0;

    gapsX       = Math.floor(width / 10);
    gapsY       = Math.floor(height / 10);

cnv.width       = width;
cnv.height      = height;

function draw ()
{
    ctx.strokeStyle = "gray";
    ctx.lineWidth = "3";
    ctx.strokeRect(0, 0, width, height);
    ctx.lineWidth = "1";

    for (var x = 0; x < gapsX; x++)
    {
        dots[x] = [];
        for (var y = 0; y < gapsY; y++)
        {
            dots[x][y] = 0;
            ctx.strokeRect(x * 10, y * 10, 10, 10);
        }
    }
}

function start ()
{
    draw();
    isStarted = true;
    document.getElementById('steps').classList.remove("d-none");
    document.getElementById('steps').classList.add("d-block");
    document.getElementById('start').disabled   = true;
    document.getElementById('boot').disabled    = false;
}

function restart ()
{
    ctx.clearRect(0, 0, width, height);
    generations = 0;
    document.getElementById('steps').innerHTML = "Пройдено шагов: 0";
    start();
}

function run ()
{
    if (isRunning)
    {
        isRunning = false;
        if (document.getElementById('boot').innerHTML == "Остановить")
        {
            document.getElementById('boot').innerHTML = "Запустить \"жизнь\"";
            return;
        }
        document.getElementById('boot').innerHTML = "Запустить \"жизнь\"";
    }
    else
    {
        isRunning = true;
        document.getElementById('boot').innerHTML = "Остановить";
    }

    calcGen();
}

function calcGen()
{
    dots2 = [];

    cooldown++
    if (cooldown > 30)
    {
        cooldown = 0;
        for (var x = 0; x < gapsX; x++)
        {
            dots2[x] = [];
            for (var y = 0; y < gapsY; y++)
            {
                var amount = dots[calcX(x)-1][calcY(y)+1] +    // top left
                            dots[calcX(x)-1][y] +             // left
                            dots[calcX(x)-1][calcX(y)-1] +    // bottom left
                            dots[x][calcY(y)+1] +             // top
                            dots[x][calcX(y)-1] +             // bottom
                            dots[calcY(x)+1][calcY(y)+1] +    // top right
                            dots[calcY(x)+1][y] +             // right
                            dots[calcY(x)+1][calcX(y)-1];     // bottom right
                
                if (dots[x][y])
                {
                    if (amount == 3 || amount == 2)
                    {
                        dots2[x][y] = 1;
                        ctx.fillRect(x * 10, y * 10, 10, 10);
                    }
                    else
                    {
                        dots2[x][y] = 0;
                        ctx.clearRect(x * 10, y * 10, 10, 10);
                        ctx.strokeRect(x * 10, y * 10, 10, 10);
                    }
                } 
                else
                {
                    if (amount == 3)
                    {
                        dots2[x][y] = 1;
                        ctx.fillRect(x * 10, y * 10, 10, 10);
                    }
                    else
                    {
                        dots2[x][y] = 0;
                        ctx.clearRect(x * 10, y * 10, 10, 10);
                        ctx.strokeRect(x * 10, y * 10, 10, 10);
                    }
                }
            }
        }
        dots = dots2;
        generations++;
        document.getElementById('steps').innerHTML = "Пройдено шагов: " + generations;
    }
    if (isRunning)
        requestAnimationFrame(calcGen);
    
}

function calcX (x)
{
    return (x == 0) ? gapsX : x;
}

function calcY (y)
{
    return (y == gapsY - 1) ? -1 : y;
}

document.getElementById('boot').disabled    = true;
document.getElementById('start').onclick    = start;
document.getElementById('boot').onclick     = run;
document.getElementById('restart').onclick  = restart;

cnv.onclick = function (e)
{
    var
        x = Math.floor(e.offsetX / 10);
        y = Math.floor(e.offsetY / 10);
    
    if (isStarted && !isRunning)
    {
        if (dots[x][y])
        {   
            ctx.clearRect(x * 10, y * 10, 10, 10);
            ctx.strokeRect(x * 10, y * 10, 10, 10);
            dots[x][y] = 0;
        }
        else
        {
            ctx.fillStyle = "black";
            ctx.fillRect(x * 10, y * 10, 10, 10);
            dots[x][y] = 1;
        }
    }
};