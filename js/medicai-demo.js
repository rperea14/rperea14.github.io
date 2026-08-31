/**
 * MedicAI Interactive Ambient AI Scribe & Clinical Extraction Sandbox
 */

document.addEventListener('DOMContentLoaded', () => {
    initMedicAISandbox();
});

function initMedicAISandbox() {
    const startBtn = document.getElementById('start-scribe-btn');
    const resetBtn = document.getElementById('reset-scribe-btn');
    const statusPill = document.getElementById('scribe-status-pill');
    const transcriptFeed = document.getElementById('transcript-feed');
    const waveformCanvas = document.getElementById('waveform-canvas');
    const timerDisplay = document.getElementById('audio-timer');
    const soapSubjective = document.getElementById('soap-subjective');
    const soapObjective = document.getElementById('soap-objective');
    const soapAssessment = document.getElementById('soap-assessment');
    const soapPlan = document.getElementById('soap-plan');
    const icdSuggestions = document.getElementById('icd-suggestions');

    if (!startBtn || !waveformCanvas) return;

    let isRunning = false;
    let animFrameId = null;
    let timerInterval = null;
    let secondsElapsed = 0;
    let currentStep = 0;

    // Canvas context
    const ctx = waveformCanvas.getContext('2d');
    function resizeCanvas() {
        waveformCanvas.width = waveformCanvas.parentElement.clientWidth;
        waveformCanvas.height = 60;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simulated Consultation Dialogue Script
    const consultationScript = [
        {
            time: '00:03',
            speaker: 'doc',
            name: 'Dr. Rodrigo Perea',
            text: 'Good morning, Carlos. How have your blood sugar levels and energy been feeling over the last month?',
            extract: null
        },
        {
            time: '00:08',
            speaker: 'pat',
            name: 'Carlos Mendoza (Patient)',
            text: 'Good morning, Doctor. I have had occasional morning fatigue and some mild dizziness after meals. My fasting morning glucose has been hovering around 145 mg/dL.',
            extract: {
                target: 'subjective',
                text: '• Chief Complaint: Morning fatigue, postprandial dizziness.\n• History of Present Illness: 52-year-old male with 4-year history of Type 2 Diabetes presenting for routine follow-up. Self-monitored fasting morning blood glucose averaging ~145 mg/dL.'
            }
        },
        {
            time: '00:16',
            speaker: 'doc',
            name: 'Dr. Rodrigo Perea',
            text: 'Understood. Let us check your vitals: Blood pressure is currently 138/86 mmHg, heart rate is 72 bpm regular, and BMI is 28.4.',
            extract: {
                target: 'objective',
                text: '• Vitals: BP 138/86 mmHg | HR 72 bpm | BMI 28.4 kg/m² | SpO2 98%.\n• Physical Exam: Alert, oriented x3. Normal heart sounds S1/S2, regular rhythm. No peripheral pedal edema detected.'
            }
        },
        {
            time: '00:24',
            speaker: 'doc',
            name: 'Dr. Rodrigo Perea',
            text: 'Based on your glucose logs and today\'s readings, your glycemic control is slightly suboptimal. We will adjust your Metformin dosage and add lifestyle coaching.',
            extract: {
                target: 'assessment',
                text: '1. Type 2 Diabetes Mellitus without complications (E11.9) - Suboptimally controlled.\n2. Essential (Primary) Hypertension (I10) - Stage 1, moderately controlled.',
                icd: [
                    { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications', conf: '98%' },
                    { code: 'I10', desc: 'Essential (primary) hypertension', conf: '95%' }
                ]
            }
        },
        {
            time: '00:32',
            speaker: 'doc',
            name: 'Dr. Rodrigo Perea',
            text: 'I am ordering an updated HbA1c and lipid panel. Please increase Metformin to 850mg twice daily with meals and maintain your low-glycemic dietary regimen. Follow up in 6 weeks.',
            extract: {
                target: 'plan',
                text: '• Diagnostics: Order HbA1c, comprehensive metabolic panel, and fasting lipid profile.\n• Pharmacotherapy: Metformin 850mg PO BID with meals.\n• Management: Continue Losartan 50mg daily; nutrition & physical activity plan.\n• Follow-up: 6 weeks with lab results.'
            }
        }
    ];

    // Waveform rendering
    let wavePhase = 0;
    function drawWaveform() {
        ctx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
        const width = waveformCanvas.width;
        const height = waveformCanvas.height;
        const bars = 45;
        const barWidth = width / bars - 3;

        for (let i = 0; i < bars; i++) {
            let barHeight = 4;
            if (isRunning) {
                const sinVal = Math.sin(wavePhase + i * 0.35) * Math.cos(wavePhase * 0.7 + i * 0.2);
                barHeight = Math.max(6, Math.abs(sinVal) * (height * 0.75));
            }

            const x = i * (barWidth + 3);
            const y = (height - barHeight) / 2;

            const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
            if (isRunning) {
                grad.addColorStop(0, '#06b6d4');
                grad.addColorStop(1, '#3b82f6');
            } else {
                grad.addColorStop(0, 'rgba(156, 163, 175, 0.3)');
                grad.addColorStop(1, 'rgba(107, 114, 128, 0.2)');
            }

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, 3);
            ctx.fill();
        }

        if (isRunning) {
            wavePhase += 0.12;
            animFrameId = requestAnimationFrame(drawWaveform);
        }
    }

    // Initial draw
    drawWaveform();

    function formatTime(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function appendTranscript(item) {
        const bubble = document.createElement('div');
        bubble.className = `transcript-bubble ${item.speaker === 'doc' ? 'doctor' : 'patient'}`;
        bubble.innerHTML = `
            <div class="speaker-avatar ${item.speaker === 'doc' ? 'doc' : 'pat'}">
                ${item.speaker === 'doc' ? '👨‍⚕️' : '👤'}
            </div>
            <div class="speaker-content">
                <div class="speaker-header">
                    <span>${item.name}</span>
                    <span>${item.time}</span>
                </div>
                <div class="speaker-text">${item.text}</div>
            </div>
        `;
        transcriptFeed.appendChild(bubble);
        transcriptFeed.scrollTop = transcriptFeed.scrollHeight;
    }

    function updateAIOutput(extract) {
        if (!extract) return;

        if (extract.target === 'subjective' && soapSubjective) {
            typewriterText(soapSubjective, extract.text);
        } else if (extract.target === 'objective' && soapObjective) {
            typewriterText(soapObjective, extract.text);
        } else if (extract.target === 'assessment' && soapAssessment) {
            typewriterText(soapAssessment, extract.text);
            if (extract.icd && icdSuggestions) {
                icdSuggestions.innerHTML = '';
                extract.icd.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'icd-card';
                    card.innerHTML = `
                        <div>
                            <span class="icd-code">${item.code}</span>
                            <span class="icd-desc">${item.desc}</span>
                        </div>
                        <span class="confidence-pill">${item.conf} match</span>
                    `;
                    icdSuggestions.appendChild(card);
                });
            }
        } else if (extract.target === 'plan' && soapPlan) {
            typewriterText(soapPlan, extract.text);
        }
    }

    function typewriterText(element, text) {
        element.textContent = text;
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.5s ease-in';
        setTimeout(() => { element.style.opacity = '1'; }, 50);
    }

    function stepConsultation() {
        if (!isRunning || currentStep >= consultationScript.length) {
            if (currentStep >= consultationScript.length) {
                stopScribe(true);
            }
            return;
        }

        const item = consultationScript[currentStep];
        appendTranscript(item);
        if (item.extract) {
            setTimeout(() => updateAIOutput(item.extract), 400);
        }

        currentStep++;

        if (currentStep < consultationScript.length) {
            setTimeout(stepConsultation, 2800);
        } else {
            setTimeout(() => stopScribe(true), 2500);
        }
    }

    function startScribe() {
        isRunning = true;
        startBtn.innerHTML = '⏸ Pause Scribe Demo';
        startBtn.classList.remove('btn-cyan');
        startBtn.classList.add('btn-secondary');
        
        statusPill.className = 'status-pill recording';
        statusPill.innerHTML = '<span class="live-indicator"></span> Live Deepgram Nova-3 Stream';

        timerInterval = setInterval(() => {
            secondsElapsed++;
            if (timerDisplay) timerDisplay.textContent = formatTime(secondsElapsed);
        }, 1000);

        drawWaveform();
        stepConsultation();
    }

    function stopScribe(completed = false) {
        isRunning = false;
        clearInterval(timerInterval);
        cancelAnimationFrame(animFrameId);
        drawWaveform();

        startBtn.innerHTML = completed ? '✓ Demo Finished (Replay)' : '▶ Resume Scribe Demo';
        startBtn.classList.add('btn-cyan');
        startBtn.classList.remove('btn-secondary');

        statusPill.className = 'status-pill ready';
        statusPill.innerHTML = completed ? '✓ Scribing Complete' : '⏸ Scribing Paused';
    }

    function resetScribe() {
        stopScribe();
        secondsElapsed = 0;
        currentStep = 0;
        if (timerDisplay) timerDisplay.textContent = '00:00';
        transcriptFeed.innerHTML = `
            <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.9rem;">
                Click <strong>"Start Scribe Demo"</strong> to simulate live ambient consultation recording with multi-speaker diarization and automated SOAP note extraction.
            </div>
        `;
        if (soapSubjective) soapSubjective.textContent = 'Waiting for patient dialogue stream...';
        if (soapObjective) soapObjective.textContent = 'Waiting for physical examination & vitals data...';
        if (soapAssessment) soapAssessment.textContent = 'Awaiting clinical dialogue analysis...';
        if (soapPlan) soapPlan.textContent = 'Awaiting treatment & prescription orders...';
        if (icdSuggestions) icdSuggestions.innerHTML = '<div style="font-size: 0.82rem; color: var(--text-muted);">No diagnoses extracted yet.</div>';

        startBtn.innerHTML = '▶ Start Scribe Demo';
        statusPill.className = 'status-pill ready';
        statusPill.innerHTML = '● Ready to Stream';
    }

    startBtn.addEventListener('click', () => {
        if (isRunning) {
            stopScribe();
        } else {
            if (currentStep >= consultationScript.length) {
                resetScribe();
            }
            startScribe();
        }
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', resetScribe);
    }
}
