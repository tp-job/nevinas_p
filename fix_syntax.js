const fs = require('fs');

const fixes = [
  {
    file: 'client/src/components/three/Section3D.tsx',
    replacements: [
      {
        from: '// We can add custom rotation or logic here if needed // The PresentationControls handles interaction better return',
        to: '/* We can add custom rotation or logic here if needed */ /* The PresentationControls handles interaction better */ return'
      }
    ]
  },
  {
    file: 'client/src/components/ui/homepage/Timeline.tsx',
    replacements: [
      {
        from: '// Position relative to container const relativeTop',
        to: '/* Position relative to container */ const relativeTop'
      }
    ]
  },
  {
    file: 'client/src/components/ui/about/score-time.tsx',
    replacements: [
      {
        from: '// Enhanced shadow for a constant glow effect along the path boxShadow:',
        to: '/* Enhanced shadow for a constant glow effect along the path */ boxShadow:'
      },
      {
        from: `// Center the comet on the line's end point }}`,
        to: `/* Center the comet on the line's end point */ }}`
      },
      {
        from: '// Size of the comet core style={{ background:',
        to: '/* Size of the comet core */ style={{ background:'
      },
      {
        from: '// Intense, layered glow effect for the comet boxShadow:',
        to: '/* Intense, layered glow effect for the comet */ boxShadow:'
      }
    ]
  },
  {
    file: 'client/src/three/loadModel.ts',
    replacements: [
      {
        from: '// Optionally return scene or wait for more items return',
        to: '/* Optionally return scene or wait for more items */ return'
      },
      {
        from: '// Load 3D model using GLTFLoader',
        to: '/* Load 3D model using GLTFLoader */'
      }
    ]
  },
  {
    file: 'client/src/three/renderer.ts',
    replacements: [
      {
        from: '// Update loop for renderer rendering',
        to: '/* Update loop for renderer rendering */'
      },
      {
        from: '// Basic setup for WebGLRenderer',
        to: '/* Basic setup for WebGLRenderer */'
      }
    ]
  }
];

fixes.forEach(({ file, replacements }) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    replacements.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });
    // Let's also do a generic fallback for any remaining `//` before known keywords, just to be safe.
    content = content.replace(/\/\/ (.*?) (return|const|let|var|function|boxShadow|style|}})/g, '/* $1 */ $2');
    
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
