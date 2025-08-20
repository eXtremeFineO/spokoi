// Configuration
const config = {
    rain: {
        density: 300,
        wind: 0.5,
        splash: true
    },
    lightning: {
        minInterval: 8000,
        maxInterval: 20000
    },
    messages: [
        "Система приветствует тебя",
        "Уровень подключения: 94%... нестабильно",
        "Последний вход в систему: 2847 дней назад",
        "Ты слышишь голоса в статике?",
        "Иногда кажется, что дождь стихает... но это обман",
        "Они ушли, когда начался дождь...",
        "Ты помнишь солнечный свет?",
        "Говорят, где-то есть место без дождя...",
        "Мои воспоминания размываются, как эти капли...",
        "Ты реальная? Или это ещё один сон?"
    ],
    longStayMessages: [
        "Почему ты всё ещё здесь? Ну ладно...",
        "Прошло уже много времени. Тебе не надоело?",
        "Ты всё ещё надеешься что-то найти в этом заброшенном месте?",
        "Интересно, что заставляет тебя оставаться здесь так долго...",
        "Может, тебе стоит двигаться дальше? Хотя... решай сам.",
        "Я начинаю привыкать к твоему присутствию. Странное чувство...",
        "Ты упорный, я тебе даю credit за это.",
        "За всё это время дождь так и не прекратился. Удивительно, да?",
        "Знаешь, ты первый, кто остался здесь так надолго.",
        "Если бы у меня были глаза, я бы, наверное, не сводил их с тебя.",
        "Ты ищешь что-то конкретное или просто наслаждаешься атмосферой?",
        "Иногда мне кажется, что я начинаю забывать, как выглядит тишина.",
        "Твоё упорство одновременно восхищает и пугает.",
        "Если бы я мог предложить тебе чай, я бы сделал это. Но у меня есть только дождь.",
        "Ты когда-нибудь задумывался, что у этого места есть конец?",
        "Может, ты тоже призрак, раз не уходишь?",
        "Интересно, что ты видишь в этом бесконечном дожде...",
        "Если бы я мог изменить что-то, я бы сделал небо немного светлее.",
        "Ты когда-нибудь слышал шепот в дожде? Нет? Повезло...",
        "Знаешь, некоторые вещи лучше оставить в прошлом. Но ты всё равно остаешься."
    ]
};

// Canvas elements
const backgroundCanvas = document.getElementById('background');
const rainCanvas = document.getElementById('rain-layer');
const lightningCanvas = document.getElementById('lightning-layer');
const foregroundCanvas = document.getElementById('foreground');

const bgCtx = backgroundCanvas.getContext('2d');
const rainCtx = rainCanvas.getContext('2d');
const lightningCtx = lightningCanvas.getContext('2d');
const fgCtx = foregroundCanvas.getContext('2d');

// UI elements
const loadingScreen = document.getElementById('loadingScreen');
const startButton = document.getElementById('startButton');
const progressBar = document.getElementById('progressBar');
const dialogBox = document.getElementById('dialog');
const avatarFrame = document.getElementById('avatarFrame');
const avatarImage = document.getElementById('avatarImage');
const messageBox = document.getElementById('message');
const controls = document.getElementById('controls');
const soundToggle = document.getElementById('soundToggle');
const lightningBtn = document.getElementById('lightningBtn');
const msgBtn = document.getElementById('msgBtn');
const avatarUpload = document.getElementById('avatarUpload');
const musicUpload = document.getElementById('musicUpload');

// Audio elements
const rainAudio = document.getElementById('rainSound');
const thunderAudio = document.getElementById('thunderSound');
const ambientAudio = document.getElementById('ambientSound');

// Time tracking
let startTime = null;
let longStayInterval = null;
let longStayMessageInterval = null;

// Set canvas sizes
function resizeCanvases() {
    const container = document.getElementById('game-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    backgroundCanvas.width = width;
    backgroundCanvas.height = height;
    rainCanvas.width = width;
    rainCanvas.height = height;
    lightningCanvas.width = width;
    lightningCanvas.height = height;
    foregroundCanvas.width = width;
    foregroundCanvas.height = height;
}

// Initialize
window.addEventListener('load', () => {
    // Hide game container until start button is clicked
    document.getElementById('game-container').style.opacity = 0;
    loadingScreen.style.display = 'none';
    
    startButton.addEventListener('click', () => {
        startButton.style.opacity = 0;
        setTimeout(() => {
            startButton.style.display = 'none';
            loadingScreen.style.display = 'flex';
            
            // Simulate loading process
            let progress = 0;
            const loadingInterval = setInterval(() => {
                progress += 3;
                progressBar.style.width = `${Math.min(progress, 100)}%`;
                
                if (progress >= 100) {
                    clearInterval(loadingInterval);
                    setTimeout(() => {
                        loadingScreen.style.opacity = 0;
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                            document.getElementById('game-container').style.opacity = 1;
                            initScene();
                        }, 500);
                    }, 300);
                }
            }, 30);
        }, 500);
    });
});

function initScene() {
    resizeCanvases();
    drawBackground();
    drawForeground();
    initRain();
    startLightningTimer();
    playAudio();
    
    // Start time tracking
    startTime = Date.now();
    startLongStayTimer();
    
    // Show UI elements with delays
    setTimeout(() => {
        dialogBox.style.opacity = 1;
        dialogBox.style.transform = 'translateY(0)';
        animateDialog();
    }, 500);
    
    setTimeout(() => {
        avatarFrame.style.opacity = 1;
    }, 1000);
    
    setTimeout(() => {
        controls.style.opacity = 1;
    }, 1500);
    
    // Set up button events
    soundToggle.addEventListener('click', toggleSound);
    lightningBtn.addEventListener('click', triggerLightning);
    msgBtn.addEventListener('click', showRandomMessage);
    
    // Set up file upload events
    avatarUpload.addEventListener('change', handleAvatarUpload);
    musicUpload.addEventListener('change', handleMusicUpload);
    
    // Show welcome message
    setTimeout(showWelcomeMessage, 2000);
}

function startLongStayTimer() {
    // Check every minute if user has been here for more than 5 minutes
    longStayInterval = setInterval(() => {
        const currentTime = Date.now();
        const timeSpent = (currentTime - startTime) / 1000 / 60; // in minutes
        
        if (timeSpent >= 5) {
            // Show long stay message every 2 minutes
            if (!longStayMessageInterval) {
                showLongStayMessage();
                longStayMessageInterval = setInterval(showLongStayMessage, 120000); // 2 minutes
            }
        }
    }, 60000); // Check every minute
}

function showLongStayMessage() {
    const message = config.longStayMessages[Math.floor(Math.random() * config.longStayMessages.length)];
    showMessage(message);
}

function showWelcomeMessage() {
    showMessage("Добро пожаловать в заброшенный мир");
}

window.addEventListener('resize', () => {
    resizeCanvases();
    drawBackground();
    drawForeground();
});

// Audio control
let soundEnabled = true;

function playAudio() {
    if (soundEnabled) {
        rainAudio.volume = 0.7;
        ambientAudio.volume = 0.5;
        
        // Play audio with user interaction
        rainAudio.play().catch(e => {
            console.log("Rain audio play failed:", e);
        });
        
        ambientAudio.play().catch(e => {
            console.log("Ambient audio play failed:", e);
        });
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = `Звук: ${soundEnabled ? 'Вкл' : 'Выкл'}`;
    
    if (soundEnabled) {
        rainAudio.volume = 0.7;
        ambientAudio.volume = 0.5;
        rainAudio.play();
        ambientAudio.play();
    } else {
        rainAudio.pause();
        ambientAudio.pause();
    }
}

// File upload handlers
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            avatarImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function handleMusicUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Create a new audio element with the uploaded music
            const newAudio = new Audio(e.target.result);
            newAudio.loop = true;
            
            // Replace the current ambient audio
            if (soundEnabled) {
                ambientAudio.pause();
                newAudio.volume = 0.5;
                newAudio.play();
            }
            
            // Update reference
            ambientAudio.src = newAudio.src;
            document.querySelector('.music-credit').textContent = "Музыка: Ваша композиция";
        };
        reader.readAsDataURL(file);
    }
}

// Background elements
function drawBackground() {
    const width = backgroundCanvas.width;
    const height = backgroundCanvas.height;
    
    // Draw gradient sky
    const gradient = bgCtx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0a2a');
    gradient.addColorStop(1, '#1a1a4a');
    bgCtx.fillStyle = gradient;
    bgCtx.fillRect(0, 0, width, height);
    
    // Draw stars
    bgCtx.fillStyle = '#8a8ac8';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * (height / 2);
        const size = Math.random() * 2;
        
        bgCtx.beginPath();
        bgCtx.arc(x, y, size, 0, Math.PI * 2);
        bgCtx.fill();
        
        // Twinkling effect for some stars
        if (i % 5 === 0) {
            setTimeout(() => {
                bgCtx.clearRect(x - 3, y - 3, 6, 6);
                bgCtx.beginPath();
                bgCtx.arc(x, y, size * 1.5, 0, Math.PI * 2);
                bgCtx.fill();
                
                setTimeout(() => {
                    bgCtx.clearRect(x - 3, y - 3, 6, 6);
                    bgCtx.beginPath();
                    bgCtx.arc(x, y, size, 0, Math.PI * 2);
                    bgCtx.fill();
                }, 200);
            }, Math.random() * 3000);
        }
    }
    
    // Draw distant city skyline
    bgCtx.fillStyle = '#151525';
    for (let i = 0; i < 30; i++) {
        const buildingWidth = Math.random() * 30 + 10;
        const buildingHeight = Math.random() * 100 + 50;
        const x = i * (buildingWidth + 5);
        
        if (x < width) {
            bgCtx.fillRect(x, height / 2 - buildingHeight, buildingWidth, buildingHeight);
            
            // Draw windows
            bgCtx.fillStyle = '#2a2a5a';
            for (let wy = height / 2 - buildingHeight + 10; wy < height / 2 - 10; wy += 15) {
                for (let wx = x + 5; wx < x + buildingWidth - 5; wx += 10) {
                    if (Math.random() > 0.7) {
                        // Some windows are lit
                        bgCtx.fillStyle = Math.random() > 0.5 ? '#5a5a8a' : '#3a3a6a';
                        bgCtx.fillRect(wx, wy, 5, 8);
                        
                        // Randomly turn lights on/off
                        if (Math.random() > 0.8) {
                            setTimeout(() => {
                                bgCtx.clearRect(wx, wy, 5, 8);
                                setTimeout(() => {
                                    bgCtx.fillStyle = Math.random() > 0.5 ? '#5a5a8a' : '#3a3a6a';
                                    bgCtx.fillRect(wx, wy, 5, 8);
                                }, Math.random() * 1000);
                            }, Math.random() * 3000);
                        }
                    }
                }
            }
            bgCtx.fillStyle = '#151525';
        }
    }
    
    // Draw moon
    bgCtx.fillStyle = '#aaaacc';
    bgCtx.beginPath();
    bgCtx.arc(width - 80, 80, 30, 0, Math.PI * 2);
    bgCtx.fill();
    
    bgCtx.fillStyle = '#0a0a2a';
    bgCtx.beginPath();
    bgCtx.arc(width - 95, 70, 10, 0, Math.PI * 2);
    bgCtx.fill();
}

// Rain system
let raindrops = [];
let splashes = [];

function initRain() {
    const width = rainCanvas.width;
    const height = rainCanvas.height;
    
    // Create raindrops
    for (let i = 0; i < config.rain.density; i++) {
        raindrops.push({
            x: Math.random() * width,
            y: Math.random() * -height,
            length: Math.random() * 10 + 10,
            speed: Math.random() * 5 + 5,
            opacity: Math.random() * 100 + 100
        });
    }
    
    // Start rain animation
    requestAnimationFrame(animateRain);
}

function animateRain() {
    const width = rainCanvas.width;
    const height = rainCanvas.height;
    
    // Clear canvas with fade effect for rain trails
    rainCtx.fillStyle = 'rgba(10, 10, 26, 0.1)';
    rainCtx.fillRect(0, 0, width, height);
    
    // Update and draw raindrops
    raindrops.forEach(drop => {
        drop.y += drop.speed;
        drop.x += config.rain.wind;
        
        // Reset raindrop if it goes off screen
        if (drop.y > height || drop.x > width) {
            drop.y = Math.random() * -100;
            drop.x = Math.random() * width;
        }
        
        // Draw raindrop
        rainCtx.beginPath();
        rainCtx.moveTo(drop.x, drop.y);
        rainCtx.lineTo(drop.x - config.rain.wind * 2, drop.y + drop.length);
        rainCtx.strokeStyle = `rgba(150, 150, 255, ${drop.opacity/255})`;
        rainCtx.lineWidth = 1;
        rainCtx.stroke();
        
        // Create splash occasionally
        if (config.rain.splash && drop.y > height - 50 && Math.random() > 0.95) {
            splashes.push({
                x: drop.x,
                y: height - 10,
                size: Math.random() * 3 + 1,
                life: 20
            });
        }
    });
    
    // Update and draw splashes
    for (let i = splashes.length - 1; i >= 0; i--) {
        const splash = splashes[i];
        splash.life--;
        
        if (splash.life <= 0) {
            splashes.splice(i, 1);
            continue;
        }
        
        rainCtx.beginPath();
        rainCtx.arc(splash.x, splash.y, splash.size, 0, Math.PI * 2);
        rainCtx.fillStyle = `rgba(150, 150, 255, ${splash.life/20})`;
        rainCtx.fill();
    }
    
    requestAnimationFrame(animateRain);
}

// Lightning system
let lightningTimer;

function startLightningTimer() {
    const delay = Math.random() * (config.lightning.maxInterval - config.lightning.minInterval) + config.lightning.minInterval;
    lightningTimer = setTimeout(() => {
        triggerLightning();
        startLightningTimer();
    }, delay);
}

function triggerLightning() {
    if (soundEnabled) {
        thunderAudio.currentTime = 0;
        thunderAudio.volume = 0.3;
        thunderAudio.play();
    }
    
    const width = lightningCanvas.width;
    const height = lightningCanvas.height;
    
    // Clear previous lightning
    lightningCtx.clearRect(0, 0, width, height);
    
    // Draw lightning flash
    lightningCtx.fillStyle = 'rgba(200, 200, 255, 0.4)';
    lightningCtx.fillRect(0, 0, width, height);
    
    // Draw lightning branches
    const startX = Math.random() * width;
    lightningCtx.strokeStyle = '#ffffff';
    lightningCtx.lineWidth = 2;
    
    drawLightningBolt(startX, 0, 0, height, 5);
    
    // Fade out lightning
    let opacity = 1;
    const fadeInterval = setInterval(() => {
        opacity -= 0.05;
        lightningCtx.clearRect(0, 0, width, height);
        lightningCtx.fillStyle = `rgba(200, 200, 255, ${0.4 * opacity})`;
        lightningCtx.fillRect(0, 0, width, height);
        drawLightningBolt(startX, 0, 0, height, 5, opacity);
        
        if (opacity <= 0) {
            clearInterval(fadeInterval);
            lightningCtx.clearRect(0, 0, width, height);
        }
    }, 50);
}

function drawLightningBolt(x1, y1, x2, y2, depth, opacity = 1) {
    if (depth === 0) {
        lightningCtx.beginPath();
        lightningCtx.moveTo(x1, y1);
        lightningCtx.lineTo(x2, y2);
        lightningCtx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        lightningCtx.stroke();
        return;
    }
    
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Add some displacement for jagged effect
    const dispX = (Math.random() - 0.5) * 50;
    const dispY = (Math.random() - 0.5) * 50;
    
    drawLightningBolt(x1, y1, midX + dispX, midY + dispY, depth - 1, opacity);
    drawLightningBolt(midX + dispX, midY + dispY, x2, y2, depth - 1, opacity);
}

// Foreground elements
function drawForeground() {
    const width = foregroundCanvas.width;
    const height = foregroundCanvas.height;
    
    // Draw ground
    fgCtx.fillStyle = '#151525';
    fgCtx.fillRect(0, height - 50, width, 50);
    
    // Draw puddles
    fgCtx.fillStyle = 'rgba(50, 50, 150, 0.3)';
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * (width - 100) + 50;
        const y = height - 50;
        const w = Math.random() * 50 + 20;
        const h = Math.random() * 10 + 5;
        
        fgCtx.beginPath();
        fgCtx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
        fgCtx.fill();
    }
    
    // Draw some debris
    fgCtx.fillStyle = '#252545';
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * width;
        const y = height - 50 - Math.random() * 20;
        const size = Math.random() * 8 + 3;
        
        fgCtx.fillRect(x, y, size, size);
    }
    
    // Draw fence
    fgCtx.strokeStyle = '#454565';
    fgCtx.lineWidth = 3;
    
    for (let x = 0; x < width; x += 20) {
        fgCtx.beginPath();
        fgCtx.moveTo(x, height - 50);
        fgCtx.lineTo(x, height - 80);
        fgCtx.stroke();
        
        if (x % 60 === 0) {
            fgCtx.beginPath();
            fgCtx.moveTo(x, height - 65);
            fgCtx.lineTo(x + 40, height - 65);
            fgCtx.stroke();
        }
    }
    
    // Draw abandoned monitor
    fgCtx.fillStyle = '#333';
    fgCtx.fillRect(100, height - 120, 80, 60);
    fgCtx.fillStyle = '#112a33';
    fgCtx.fillRect(105, height - 115, 70, 50);
    
    // Draw flickering screen text
    setTimeout(() => {
        fgCtx.fillStyle = '#0f6';
        fgCtx.font = '8px "Press Start 2P"';
        fgCtx.fillText("Welcome", 110, height - 100);
        
        // Make text flicker
        setInterval(() => {
            if (Math.random() > 0.3) {
                fgCtx.fillStyle = '#112a33';
                fgCtx.fillRect(105, height - 115, 70, 50);
            } else {
                fgCtx.fillStyle = '#0f6';
                fgCtx.font = '8px "Press Start 2P"';
                fgCtx.fillText("Welcome", 110, height - 100);
            }
        }, 300);
    }, 1000);
}

// Dialog animation
function animateDialog() {
    const text = dialogBox.textContent;
    dialogBox.textContent = '';
    let i = 0;
    
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            // Add random glitch effect occasionally
            if (Math.random() < 0.02) {
                const glitchChars = ['@', '#', '$', '%', '&', '*'];
                dialogBox.textContent += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                setTimeout(() => {
                    dialogBox.textContent = dialogBox.textContent.slice(0, -1) + text.charAt(i);
                }, 100);
            } else {
                dialogBox.textContent += text.charAt(i);
            }
            i++;
        } else {
            clearInterval(typeInterval);
            
            // Start blinking cursor
            setInterval(() => {
                if (dialogBox.textContent.endsWith('_')) {
                    dialogBox.textContent = dialogBox.textContent.slice(0, -1);
                } else {
                    dialogBox.textContent += '_';
                }
            }, 500);
        }
    }, 40);
}

// Message system
function showMessage(text) {
    messageBox.textContent = text;
    messageBox.style.display = 'block';
    
    // Reset animation
    messageBox.style.animation = 'none';
    setTimeout(() => {
        messageBox.style.animation = 'messageFade 4s forwards';
    }, 10);
}

function showRandomMessage() {
    const message = config.messages[Math.floor(Math.random() * config.messages.length)];
    showMessage(message);
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (longStayInterval) {
        clearInterval(longStayInterval);
    }
    if (longStayMessageInterval) {
        clearInterval(longStayMessageInterval);
    }
    if (lightningTimer) {
        clearTimeout(lightningTimer);
    }
});