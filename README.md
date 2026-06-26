# Doughnut Box Sling

A mobile-first Phaser 3 prototype inspired by sling puck games, rebuilt as a cute top-down doughnut box game.

## Run

Serve this folder from any static web server and open the URL in a browser:

```powershell
node -e "const http=require('http'),fs=require('fs'),path=require('path');const root=process.cwd();const types={'.html':'text/html','.js':'text/javascript','.css':'text/css'};http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p==='/' )p='/index.html';const file=path.join(root,p);fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data)})}).listen(5173,'127.0.0.1',()=>console.log('http://127.0.0.1:5173'))"
```

## Controls

Touch or click a doughnut, drag backward, and release. The same Phaser pointer input path handles touch and mouse.

## Modes

Choose either local two-player mode or player vs AI from the start menu. The player can pick Team Glazed or Team Chocolate; the opponent automatically uses the other team. AI mode supports easy, medium, and hard difficulties by changing shot timing, aim accuracy, and launch speed.

## Notes

The prototype uses Phaser primitives for all graphics and small synthesized Web Audio tones for sound. Phaser is loaded from jsDelivr in `index.html`; for fully offline use, download Phaser and point the script tag to the local file.
