const canvas=document.getElementById('tetris'),ctx=canvas.getContext('2d'),nextCanvas=document.getElementById('nextPiece'),nextCtx=nextCanvas.getContext('2d');
const overlay=document.getElementById('blocksOverlay'),title=document.getElementById('overlayTitle'),overlayText=document.getElementById('overlayText'),startButton=document.getElementById('blocksStart');
const blockRanking=GameRanking.create({game:'blocks'});
const scoreEl=document.getElementById('blocksScore'),levelEl=document.getElementById('blocksLevel'),linesEl=document.getElementById('blocksLines');
const COLS=10,ROWS=20,SIZE=30,COLORS=[null,'#35c9e8','#f3d04f','#a96df0','#55d67b','#ec5968','#4d7ff0','#f09642'];
const SHAPES={I:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],O:[[2,2],[2,2]],T:[[0,3,0],[3,3,3],[0,0,0]],S:[[0,4,4],[4,4,0],[0,0,0]],Z:[[5,5,0],[0,5,5],[0,0,0]],J:[[6,0,0],[6,6,6],[0,0,0]],L:[[0,0,7],[7,7,7],[0,0,0]]},TYPES=Object.keys(SHAPES);
let board,piece,next,bag,score,lines,level,running=false,paused=false,lastTime=0,dropCounter=0;
const emptyBoard=()=>Array.from({length:ROWS},()=>Array(COLS).fill(0));
function makePiece(){if(!bag?.length)bag=[...TYPES].sort(()=>Math.random()-.5);const type=bag.pop();return{matrix:SHAPES[type].map(r=>[...r]),x:3,y:0,type};}
function collide(test=piece){return test.matrix.some((row,y)=>row.some((v,x)=>v&&(test.y+y>=ROWS||test.x+x<0||test.x+x>=COLS||(test.y+y>=0&&board[test.y+y][test.x+x]))));}
function merge(){piece.matrix.forEach((row,y)=>row.forEach((v,x)=>{if(v&&piece.y+y>=0)board[piece.y+y][piece.x+x]=v;}));}
function clearLines(){let count=0,oldLevel=level;for(let y=ROWS-1;y>=0;y--){if(board[y].every(Boolean)){board.splice(y,1);board.unshift(Array(COLS).fill(0));count++;y++;}}if(count){lines+=count;score+=[0,100,300,500,800][count]*level;level=Math.floor(lines/10)+1;updateHud();GameAudio.play(level>oldLevel?'level':'clear');}}
function spawn(){piece=next||makePiece();piece.x=Math.floor((COLS-piece.matrix[0].length)/2);piece.y=0;next=makePiece();drawNext();if(collide()){running=false;GameAudio.play('fail');showOverlay('게임 오버',`${score.toLocaleString('ko-KR')}점 · ${lines}줄을 완성했습니다.`,'다시 시작');blockRanking.finish(score,level);}}
function move(dx){const moved={...piece,x:piece.x+dx};if(!collide(moved)){piece.x+=dx;GameAudio.play('move');}}
function down(manual=false){piece.y++;if(collide()){piece.y--;merge();clearLines();spawn();}else if(manual){score++;updateHud();}dropCounter=0;}
function rotate(){const original=piece.matrix,oldX=piece.x,turned=original[0].map((_,i)=>original.map(row=>row[i]).reverse());piece.matrix=turned;for(const kick of [0,-1,1,-2,2]){piece.x=oldX+kick;if(!collide()){GameAudio.play('rotate');return;}}piece.x=oldX;piece.matrix=original;}
function hardDrop(){let distance=0;while(!collide({...piece,y:piece.y+1})){piece.y++;distance++;}score+=distance*2;updateHud();GameAudio.play('drop');down();}
function updateHud(){scoreEl.textContent=score.toLocaleString('ko-KR');levelEl.textContent=level;linesEl.textContent=lines;}
function drawCell(target,x,y,value,size=SIZE){target.fillStyle=COLORS[value];target.fillRect(x*size+1,y*size+1,size-2,size-2);target.fillStyle='rgba(255,255,255,.2)';target.fillRect(x*size+3,y*size+3,size-6,3);}
function draw(){ctx.fillStyle='#080d15';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle='#172231';for(let x=0;x<=COLS;x++){ctx.beginPath();ctx.moveTo(x*SIZE,0);ctx.lineTo(x*SIZE,canvas.height);ctx.stroke();}for(let y=0;y<=ROWS;y++){ctx.beginPath();ctx.moveTo(0,y*SIZE);ctx.lineTo(canvas.width,y*SIZE);ctx.stroke();}board.forEach((row,y)=>row.forEach((v,x)=>v&&drawCell(ctx,x,y,v)));if(piece)piece.matrix.forEach((row,y)=>row.forEach((v,x)=>v&&drawCell(ctx,piece.x+x,piece.y+y,v)));}
function drawNext(){nextCtx.clearRect(0,0,120,120);const size=24,w=next.matrix[0].length*size,h=next.matrix.length*size,ox=(120-w)/2,oy=(120-h)/2;next.matrix.forEach((row,y)=>row.forEach((v,x)=>{if(v){nextCtx.fillStyle=COLORS[v];nextCtx.fillRect(ox+x*size+1,oy+y*size+1,size-2,size-2);}}));}
function frame(time=0){if(!running)return;const delta=time-lastTime;lastTime=time;if(!paused){dropCounter+=delta;if(dropCounter>Math.max(100,900-(level-1)*75))down();draw();}requestAnimationFrame(frame);}
function showOverlay(heading,text,button){title.textContent=heading;overlayText.textContent=text;startButton.textContent=button;overlay.hidden=false;}
function startGame(){GameAudio.play('click');blockRanking.reset();board=emptyBoard();bag=[];score=0;lines=0;level=1;next=makePiece();running=true;paused=false;dropCounter=0;lastTime=performance.now();updateHud();spawn();overlay.hidden=true;draw();requestAnimationFrame(frame);}
function togglePause(){if(!running)return;paused=!paused;if(paused)showOverlay('일시정지','계속하려면 버튼이나 P 키를 누르세요.','계속하기');else{overlay.hidden=true;lastTime=performance.now();}}
function action(name){if(!running||paused)return;if(name==='left')move(-1);if(name==='right')move(1);if(name==='rotate')rotate();if(name==='down')down(true);if(name==='drop')hardDrop();draw();}
startButton.addEventListener('click',()=>paused?togglePause():startGame());document.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();if(e.code==='KeyP'){togglePause();return;}const map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'rotate',ArrowDown:'down',Space:'drop'};if(map[e.code])action(map[e.code]);});document.querySelectorAll('.touch-controls button').forEach(button=>button.addEventListener('pointerdown',()=>action(button.dataset.action)));
board=emptyBoard();next=makePiece();draw();drawNext();updateHud();
