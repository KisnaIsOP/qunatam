// Particle Animation in Hero Section
const initParticleAnimation = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const container = document.getElementById('particle-animation');
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Create particles with colors
    const particles = new THREE.Group();
    const particleCount = 150;
    const colors = [0x3498db, 0xe74c3c, 0x2ecc71, 0xf1c40f];
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 12, 12);
        const material = new THREE.MeshBasicMaterial({ 
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0.7
        });
        const particle = new THREE.Mesh(geometry, material);
        
        particle.position.set(
            Math.random() * 30 - 15,
            Math.random() * 30 - 15,
            Math.random() * 30 - 15
        );
        
        particle.velocity = new THREE.Vector3(
            Math.random() * 0.02 - 0.01,
            Math.random() * 0.02 - 0.01,
            Math.random() * 0.02 - 0.01
        );
        
        particle.acceleration = new THREE.Vector3(0, 0, 0);
        particles.add(particle);
    }

    scene.add(particles);
    camera.position.z = 20;

    // Add interactive mouse effect
    const mouse = new THREE.Vector2();
    const mouseInfluenceRadius = 5;
    const mouseForce = 0.1;

    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.offsetWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.offsetHeight) * 2 + 1;
    });

    const animate = () => {
        requestAnimationFrame(animate);

        particles.children.forEach(particle => {
            // Apply mouse influence
            const mousePos = new THREE.Vector3(mouse.x * 10, mouse.y * 10, 0);
            const distance = particle.position.distanceTo(mousePos);
            
            if (distance < mouseInfluenceRadius) {
                const force = mousePos.sub(particle.position).normalize().multiplyScalar(mouseForce);
                particle.acceleration.add(force);
            }

            // Update particle physics
            particle.velocity.add(particle.acceleration);
            particle.position.add(particle.velocity);
            particle.acceleration.multiplyScalar(0);

            // Boundary check with smooth transition
            ['x', 'y', 'z'].forEach(axis => {
                if (Math.abs(particle.position[axis]) > 15) {
                    particle.position[axis] *= 0.95;
                    particle.velocity[axis] *= -0.7;
                }
            });

            // Rotate particle for sparkle effect
            particle.rotation.x += 0.01;
            particle.rotation.y += 0.01;
        });

        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0005;

        renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
};

// Enhanced Wave-Particle Duality Demo
const initWaveParticleDemo = () => {
    const canvas = document.createElement('canvas');
    const container = document.getElementById('wave-particle-demo');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    let particles = [];
    let wavePhase = 0;
    let isWaveMode = true;
    
    class DualityParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height / 2;
            this.radius = 3;
            this.color = `hsl(${Math.random() * 60 + 200}, 70%, 50%)`;
            this.speed = 2;
            this.angle = Math.random() * Math.PI * 2;
        }

        update() {
            if (isWaveMode) {
                this.y = canvas.height / 2 + 
                    Math.sin(this.x * 0.02 + wavePhase) * 50;
            } else {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;

                if (this.x < 0 || this.x > canvas.width) this.angle = Math.PI - this.angle;
                if (this.y < 0 || this.y > canvas.height) this.angle = -this.angle;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Add glow effect
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius * 3
            );
            gradient.addColorStop(0, `${this.color}99`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < 30; i++) {
        particles.push(new DualityParticle());
    }

    // Toggle between wave and particle behavior
    container.addEventListener('click', () => {
        isWaveMode = !isWaveMode;
        if (!isWaveMode) {
            particles.forEach(p => {
                p.angle = Math.random() * Math.PI * 2;
            });
        }
    });

    const animate = () => {
        ctx.fillStyle = 'rgba(245, 246, 250, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        wavePhase += 0.02;
        requestAnimationFrame(animate);
    };

    animate();
};

// Enhanced Double-Slit Experiment
const initDoubleSlit = () => {
    const canvas = document.createElement('canvas');
    const simulationArea = document.querySelector('.simulation-area');
    simulationArea.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    canvas.width = simulationArea.offsetWidth;
    canvas.height = simulationArea.offsetHeight;

    const slits = [
        { x: canvas.width * 0.4, y: canvas.height * 0.4, width: 20 },
        { x: canvas.width * 0.4, y: canvas.height * 0.6, width: 20 }
    ];

    let particles = [];
    let isRunning = false;
    let interferencePattern = new Array(Math.floor(canvas.width * 0.6))
        .fill(0);

    class Particle {
        constructor() {
            this.x = 50;
            this.y = canvas.height / 2 + (Math.random() - 0.5) * canvas.height * 0.4;
            this.speed = 3;
            this.size = 2;
            this.color = `hsl(${Math.random() * 60 + 200}, 70%, 50%)`;
            this.hasPassedSlit = false;
            this.angle = 0;
        }

        update() {
            if (!this.hasPassedSlit && this.x >= slits[0].x) {
                // Check if particle passes through either slit
                const passesTopSlit = Math.abs(this.y - slits[0].y) < slits[0].width;
                const passesBottomSlit = Math.abs(this.y - slits[1].y) < slits[1].width;
                
                if (passesTopSlit || passesBottomSlit) {
                    this.hasPassedSlit = true;
                    this.angle = (Math.random() - 0.5) * Math.PI * 0.5;
                } else {
                    this.x = -10; // Remove particle if it hits barrier
                }
            }

            if (this.hasPassedSlit) {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                
                // Record interference pattern
                if (this.x > canvas.width * 0.8) {
                    const index = Math.floor(this.y / canvas.height * interferencePattern.length);
                    if (index >= 0 && index < interferencePattern.length) {
                        interferencePattern[index]++;
                    }
                }
            } else {
                this.x += this.speed;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();

            // Add glow effect
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 3
            );
            gradient.addColorStop(0, `${this.color}99`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    const drawBarrier = () => {
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(canvas.width * 0.4, 0, 10, canvas.height);
        
        // Draw slits
        slits.forEach(slit => {
            ctx.clearRect(slit.x, slit.y - slit.width, 10, slit.width * 2);
        });
    };

    const drawInterferencePattern = () => {
        const maxIntensity = Math.max(...interferencePattern);
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.8, 0);
        
        interferencePattern.forEach((intensity, index) => {
            const y = (index / interferencePattern.length) * canvas.height;
            const x = canvas.width * 0.8 + (intensity / maxIntensity) * (canvas.width * 0.2);
            ctx.lineTo(x, y);
        });
        
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)';
        ctx.stroke();
    };

    const animate = () => {
        if (!isRunning) return;

        ctx.fillStyle = 'rgba(245, 246, 250, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawBarrier();
        drawInterferencePattern();

        if (Math.random() < 0.1) {
            particles.push(new Particle());
        }

        particles = particles.filter(p => p.x > -10 && p.x < canvas.width);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    };

    // Event Listeners
    document.getElementById('start-experiment').addEventListener('click', () => {
        isRunning = true;
        animate();
    });

    document.getElementById('reset-experiment').addEventListener('click', () => {
        isRunning = false;
        particles = [];
        interferencePattern.fill(0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBarrier();
    });
};

// Quiz System
const quizQuestions = [
    {
        question: "What is wave-particle duality?",
        options: [
            "A property where particles can behave as waves and waves as particles",
            "A property of only light",
            "A mathematical concept",
            "A classical physics phenomenon"
        ],
        correct: 0
    },
    {
        question: "What is quantum superposition?",
        options: [
            "Particles moving very fast",
            "Particles existing in multiple states simultaneously",
            "Particles changing color",
            "Particles splitting into two"
        ],
        correct: 1
    },
    {
        question: "What is quantum entanglement?",
        options: [
            "Particles getting stuck together",
            "Particles moving in the same direction",
            "Particles having correlated quantum states regardless of distance",
            "Particles having the same mass"
        ],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;

const initQuiz = () => {
    const quizContainer = document.getElementById('quiz-questions');
    const startButton = document.getElementById('start-quiz');

    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        showQuestion();
    });

    function showQuestion() {
        if (currentQuestion >= quizQuestions.length) {
            showResults();
            return;
        }

        const question = quizQuestions[currentQuestion];
        const questionHTML = `
            <div class="question">
                <h3>Question ${currentQuestion + 1}:</h3>
                <p>${question.question}</p>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <button class="option-btn" onclick="checkAnswer(${index})">${option}</button>
                    `).join('')}
                </div>
            </div>
        `;

        quizContainer.innerHTML = questionHTML;
    }

    function checkAnswer(answer) {
        const question = quizQuestions[currentQuestion];
        if (answer === question.correct) {
            score++;
        }
        currentQuestion++;
        showQuestion();
    }

    function showResults() {
        const percentage = (score / quizQuestions.length) * 100;
        quizContainer.innerHTML = `
            <div class="quiz-results">
                <h3>Quiz Complete!</h3>
                <p>You scored ${score} out of ${quizQuestions.length} (${percentage}%)</p>
                <button onclick="resetQuiz()" class="quiz-btn">Try Again</button>
            </div>
        `;
    }
};

window.resetQuiz = () => {
    currentQuestion = 0;
    score = 0;
    initQuiz();
};

// Initialize everything when the page loads
window.addEventListener('load', () => {
    initParticleAnimation();
    initDoubleSlit();
    initWaveParticleDemo();
    initQuiz();

    // Tour functionality
    document.querySelector('.take-tour-btn').addEventListener('click', startTour);
    document.querySelector('.start-btn').addEventListener('click', () => {
        document.querySelector('#concepts').scrollIntoView({ behavior: 'smooth' });
    });
});

// Tour System
const startTour = () => {
    const tour = [
        {
            element: '#concepts',
            title: 'Fundamental Concepts',
            description: 'Learn the basic principles of quantum mechanics through interactive demonstrations.'
        },
        {
            element: '#mathematics',
            title: 'Mathematical Foundation',
            description: 'Understand the mathematical framework behind quantum mechanics.'
        },
        {
            element: '#interactive',
            title: 'Interactive Experiments',
            description: 'Perform virtual experiments to see quantum mechanics in action.'
        },
        {
            element: '#applications',
            title: 'Real-World Applications',
            description: 'Discover how quantum mechanics is used in modern technology.'
        }
    ];

    let currentStep = 0;

    function showTourStep() {
        if (currentStep >= tour.length) {
            endTour();
            return;
        }

        const step = tour[currentStep];
        const element = document.querySelector(step.element);
        element.scrollIntoView({ behavior: 'smooth' });

        const tourPopup = document.createElement('div');
        tourPopup.className = 'tour-popup';
        tourPopup.innerHTML = `
            <h3>${step.title}</h3>
            <p>${step.description}</p>
            <button onclick="nextTourStep()">Next</button>
        `;

        element.appendChild(tourPopup);
    }

    window.nextTourStep = () => {
        const currentPopup = document.querySelector('.tour-popup');
        if (currentPopup) {
            currentPopup.remove();
        }
        currentStep++;
        showTourStep();
    };

    function endTour() {
        const popup = document.querySelector('.tour-popup');
        if (popup) {
            popup.remove();
        }
    }

    showTourStep();
};

// Custom Cursor
const cursor = document.createElement('div');
const cursorFollower = document.createElement('div');
cursor.className = 'cursor';
cursorFollower.className = 'cursor-follower';
document.body.appendChild(cursor);
document.body.appendChild(cursorFollower);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Magnetic effect for interactive elements
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
        const rect = elem.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        elem.style.transform = `translate(${deltaX * 0.2}px, ${deltaY * 0.2}px)`;
        cursor.style.transform = `scale(2)`;
    });

    elem.addEventListener('mouseleave', () => {
        elem.style.transform = '';
        cursor.style.transform = '';
    });
});

// Particle trail effect
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = Math.random() * 10 + 5 + 'px';
    particle.style.height = particle.style.width;
    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 1000);
}

let lastParticleTime = 0;
document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    if (currentTime - lastParticleTime > 50) {
        createParticle(e.clientX, e.clientY);
        lastParticleTime = currentTime;
    }
});

// Smooth cursor animation
function animate() {
    // Cursor movement
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    // Follower movement
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';

    requestAnimationFrame(animate);
}
animate();

// Loading animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loading-animation');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Interactive hover effects
document.querySelectorAll('.interactive-btn').forEach(button => {
    button.addEventListener('mouseover', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
    });

    button.addEventListener('mouseout', () => {
        cursor.style.transform = '';
        cursorFollower.style.transform = '';
    });
});
