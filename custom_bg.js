(function() {
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) return;
    
    // Inject canvas safely
    canvasContainer.innerHTML = '<canvas id="spaceCanvas" style="display:block; width:100%; height:100%;"></canvas>';
    const canvas = document.getElementById('spaceCanvas');
    const ctx = canvas.getContext('2d');
    
    let w, h;
    let gridSizeX = 90;
    let gridSizeZ = 60;
    let spacing = 40;
    
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        let isMobile = w <= 768;
        spacing = isMobile ? 30 : 50;
        gridSizeX = isMobile ? 50 : 90;
        gridSizeZ = isMobile ? 120 : 60;
    }
    window.addEventListener('resize', resize);
    resize();
    
    const camera = { y: 900, z: 1200, rx: 0.8 };
    
    let targetWX = 0, targetWZ = 0;
    let currentWX = 0, currentWZ = 0;
    
    window.addEventListener('mousemove', (e) => {
        targetWX = (e.clientX - w/2) * 2.5;
        targetWZ = (e.clientY - h/2) * 4.0;
    });
    
    function project(wx, wy, wz) {
        let dx = wx;
        let dy = wy - camera.y;
        let dz = wz - camera.z;
        
        const cos = Math.cos(camera.rx);
        const sin = Math.sin(camera.rx);
        let dy2 = dy * cos - dz * sin;
        let dz2 = dy * sin + dz * cos;
        
        let depth = -dz2;
        if (depth < 50) return null;
        
        const fov = 1000;
        const scale = fov / depth;
        return {
            x: w / 2 + dx * scale,
            y: h / 2 - dy2 * scale
        };
    }
    
    let time = 0;
    function draw() {
        time += 0.02;
        currentWX += (targetWX - currentWX) * 0.1;
        currentWZ += (targetWZ - currentWZ) * 0.1;
        
        ctx.fillStyle = '#313131';
        ctx.fillRect(0, 0, w, h);
        
        const points = [];
        for (let i = 0; i <= gridSizeX; i++) {
            points[i] = [];
            for (let j = 0; j <= gridSizeZ; j++) {
                let px = (i - gridSizeX/2) * spacing;
                let pz = (j - gridSizeZ/2) * spacing;
                
                let py = Math.sin(px/150 + time) * Math.cos(pz/150 + time) * 35;
                
                let distSq = (px - currentWX)**2 + (pz - currentWZ)**2;
                py -= 800 * Math.exp(-distSq / 150000);
                
                points[i][j] = project(px, py, pz);
            }
        }
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; 
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        
        for (let i = 0; i <= gridSizeX; i++) {
            for (let j = 0; j <= gridSizeZ; j++) {
                const p = points[i][j];
                if (!p) continue;
                
                if (i < gridSizeX) {
                    const pr = points[i+1][j];
                    if (pr) {
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(pr.x, pr.y);
                    }
                }
                if (j < gridSizeZ) {
                    const pb = points[i][j+1];
                    if (pb) {
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(pb.x, pb.y);
                    }
                }
            }
        }
        ctx.stroke();
        
        requestAnimationFrame(draw);
    }
    draw();
})();

// Re-initialize the bento box spotlight hover effect
document.querySelectorAll('.bento-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        item.style.setProperty('--mouse-x', `${x}px`);
        item.style.setProperty('--mouse-y', `${y}px`);
    });
});
