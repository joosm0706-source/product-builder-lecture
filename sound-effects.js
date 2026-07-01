(()=>{
let audio=null,unlocked=false;
const presets={
  click:[[420,.04,.025,'square',0]],move:[[180,.025,.012,'square',0]],rotate:[[260,.035,.02,'triangle',0],[360,.04,.015,'triangle',.025]],drop:[[110,.07,.035,'square',0]],clear:[[440,.07,.03,'sine',0],[660,.09,.03,'sine',.06],[880,.12,.035,'sine',.13]],level:[[520,.08,.03,'sine',0],[700,.08,.03,'sine',.08],[980,.16,.04,'sine',.16]],
  flag:[[300,.05,.02,'square',0],[220,.04,.015,'square',.04]],win:[[523,.1,.03,'sine',0],[659,.1,.03,'sine',.1],[784,.2,.04,'sine',.2]],fail:[[220,.12,.035,'sawtooth',0],[150,.2,.04,'sawtooth',.1]],
  shoot:[[760,.035,.018,'square',0]],laser:[[980,.05,.018,'sawtooth',0]],hit:[[130,.03,.018,'triangle',0]],explosion:[[150,.12,.045,'sawtooth',0],[75,.2,.035,'square',.06]],pickup:[[600,.06,.025,'sine',0],[900,.11,.03,'sine',.055]],boss:[[110,.16,.04,'sawtooth',0],[82,.2,.04,'sawtooth',.18],[55,.35,.05,'square',.38]],upgrade:[[523,.08,.03,'sine',0],[784,.1,.035,'sine',.08],[1046,.18,.04,'sine',.18]],step:[[340,.035,.018,'triangle',0],[460,.04,.015,'triangle',.03]]
};
function context(){if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();return audio;}
function tone([frequency,duration,volume,type,delay]){const a=context(),start=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(frequency,start);if(type==='sawtooth')o.frequency.exponentialRampToValueAtTime(Math.max(45,frequency*.45),start+duration);g.gain.setValueAtTime(.001,start);g.gain.linearRampToValueAtTime(volume,start+.008);g.gain.exponentialRampToValueAtTime(.001,start+duration);o.connect(g).connect(a.destination);o.start(start);o.stop(start+duration+.02);}
function unlock(){try{context();unlocked=true;}catch(e){unlocked=false;}}
addEventListener('pointerdown',unlock,{once:true});addEventListener('keydown',unlock,{once:true});
window.GameAudio={play(name){if(!unlocked)unlock();if(!audio)return;(presets[name]||presets.click).forEach(tone);}};
})();
