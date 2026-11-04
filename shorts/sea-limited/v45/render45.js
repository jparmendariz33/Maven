const {chromium}=require('playwright');const {spawn}=require('child_process');
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
pg.on('pageerror',e=>console.log('ERR',e.message));
await pg.goto('file://'+process.argv[2]+'?render');await pg.evaluate(()=>document.fonts.ready);
const DUR_=await pg.evaluate(()=>DUR);
const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-i',process.argv[3],
 '-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-profile:v','high','-c:a','aac','-b:a','192k','-shortest','-movflags','+faststart',process.argv[4]],{stdio:['pipe','inherit','inherit']});
for(let f=0;f<Math.round(DUR_*30);f++){const d=await pg.evaluate(t=>{renderAt(t);return document.getElementById('c').toDataURL('image/jpeg',.95)},f/30);
 if(!ff.stdin.write(Buffer.from(d.split(',')[1],'base64')))await new Promise(r=>ff.stdin.once('drain',r));}
ff.stdin.end();ff.on('close',c=>{console.log('ffmpeg',c);b.close()});})();
