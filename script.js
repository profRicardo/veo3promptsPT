document.addEventListener('DOMContentLoaded', () => {
    // Encapsulating DOM element selections for better organization
    const domElements = {
        inputs: {
            subject: document.getElementById('subject'),
            action: document.getElementById('action'),
            context: document.getElementById('context'),
            style: document.getElementById('style'),
            camera_angle: document.getElementById('camera-angle'),
            camera_movement: document.getElementById('camera-movement'),
            lighting: document.getElementById('lighting'),
            quality: document.getElementById('quality'),
            negative_prompt: document.getElementById('negative_prompt')
        },
        generatedPromptEl: document.getElementById('generated-prompt'),
        progressBar: document.getElementById('prompt-progress-bar'),
        analyzerTip: document.getElementById('analyzer-tip'),
        copyBtn: document.getElementById('copy-btn'),
        exampleBtn: document.getElementById('example-btn'),
        mixerBtn: document.getElementById('mixer-btn'),
        clearBtn: document.getElementById('clear-btn'),
        modal: document.getElementById('example-modal'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        modalPromptEl: document.getElementById('modal-prompt'),
        modalAnalysisEl: document.getElementById('modal-analysis'),
        copyrightEl: document.getElementById('copyright')
    };

    // --- DATA ---
    const mixerData = {
        subjects: ['Um elefante com asas de borboleta', 'Um cavaleiro medieval a jato', 'Um detetive robô vitoriano', 'Uma rainha feiticeira intergaláctica', 'Um gato astronauta com botas', 'Uma cidade feita de relógios', 'Um polvo chef de cozinha', 'Uma bibliotecária fantasma', 'Uma estátua de jardim que ganhou vida', 'Um rio de lava', 'Uma árvore que dá frutos de cristal', 'Um arranha-céus feito de livros', 'Um dragão de origami', 'Um farol no meio de um deserto'],
        actions: ['a andar de skate numa autoestrada de arco-íris', 'a pintar uma obra-prima com luz', 'a resolver um mistério holográfico', 'a fazer jardinagem em asteroides', 'a navegar um barco de papel numa tempestade', 'a construir um castelo de areia que chega às nuvens', 'a contar histórias a animais da floresta', 'a organizar livros voadores', 'a fazer malabarismo com planetas em miniatura', 'a reger uma orquestra de robôs', 'a dançar breakdance numa teia de aranha'],
        contexts: ['numa biblioteca infinita', 'durante uma chuva de meteoros néon', 'numa cidade subaquática abandonada', 'num festival de música cyberpunk', 'num castelo flutuante acima das nuvens', 'numa estação espacial coberta de vegetação', 'dentro de um relógio de cuco gigante', 'numa praia de areia preta com dois sóis', 'numa floresta onde as árvores são de cristal', 'num mercado movimentado em Marte'],
        styles: ['in anime style', 'cinematic', 'in a vintage film style', 'in 3D animation style', 'in watercolor style', 'black and white', 'in slow motion']
    };

    const curatedMixes = [
        { subject: 'Uma cidade futurista em miniatura dentro de um globo de neve', action: 'com carros voadores a circular e pessoas pequenas a andar', context: 'a ser abanado suavemente por uma mão gigante, com neve a cair', style: 'cinematic', camera_angle: 'a close-up shot of', camera_movement: 'with a slow zoom-out', lighting: 'luz suave e mágica vinda de dentro do globo', quality: 'fotorrealista, 8K, altamente detalhado', negative_prompt: 'mão desfocada' },
        { subject: 'Um antigo dragão feito de constelações e poeira estelar', action: 'a voar majestosamente pelo cosmos', context: 'passando por nebulosas vibrantes e galáxias distantes', style: 'in 3D animation style', camera_angle: 'a wide shot of', camera_movement: 'panning from left to right', lighting: 'brilho etéreo do dragão e das nebulosas', quality: 'qualidade épica, cores vívidas', negative_prompt: 'planetas, asteroides' },
        { subject: 'Um velho relojoeiro', action: 'a dar o toque final num relógio de bolso ornamentado que controla o tempo', context: 'na sua oficina poeirenta e caótica, cheia de engrenagens', style: 'in a vintage film style', camera_angle: 'an extreme close-up shot of', camera_movement: 'with a slow zoom-in', lighting: 'luz quente de uma única lâmpada, sombras profundas', quality: 'foco nítido, grão de filme, nostálgico', negative_prompt: 'moderno, limpo' }
    ];

    const examples = [
        {
            prompt: { subject: 'Um farol solitário', action: 'a resistir a uma tempestade violenta', context: 'numa costa rochosa à noite', style: 'cinematic', camera_angle: 'a wide shot of', camera_movement: 'with a slow zoom-in', lighting: 'iluminação dramática de relâmpagos', quality: 'hyperrealistic, 8K', negative_prompt: 'mar calmo' },
            analysis: [
                { part: 'Sujeito', text: 'Define claramente o foco principal da cena.', color: '#4285F4' },
                { part: 'Ação', text: 'Cria tensão e dinamismo, contando uma história.', color: '#EA4335' },
                { part: 'Contexto', text: 'Estabelece o ambiente e a atmosfera.', color: '#34A853' },
                { part: 'Câmara', text: 'A combinação de plano aberto com zoom lento cria um efeito cinematográfico poderoso.', color: '#FBBC05' },
                { part: 'Detalhes', text: 'Iluminação e qualidade elevam o realismo e o impacto visual.', color: '#5f6368' }
            ]
        },
        {
            prompt: { subject: 'Um mercado de flores flutuante', action: 'cheio de vida, com vendedores e clientes', context: 'num canal de uma cidade de fantasia ao amanhecer', style: 'in watercolor style', camera_angle: 'a drone shot of', camera_movement: 'panning from left to right', lighting: 'luz suave da manhã, cores vibrantes', quality: 'dreamlike', negative_prompt: '' },
            analysis: [
                { part: 'Estilo', text: 'O estilo "aquarela" define uma estética visual única e artística.', color: '#4285F4' },
                { part: 'Sujeito/Ação', text: 'A descrição "cheio de vida" adiciona complexidade e movimento à cena.', color: '#EA4335' },
                { part: 'Contexto', text: 'O cenário de fantasia dá liberdade criativa à IA.', color: '#34A853' },
                { part: 'Câmara', text: 'O plano de drone com panorâmica é perfeito para revelar a escala e a beleza do mercado.', color: '#FBBC05' }
            ]
        },
        {
            prompt: { subject: 'Uma única gota de água', action: 'a cair num lago espelhado', context: 'num ambiente minimalista', style: 'black and white', camera_angle: 'an extreme close-up shot of', camera_movement: '', lighting: 'luz de estúdio focada', quality: 'in slow motion, 4K', negative_prompt: 'color' },
            analysis: [
                { part: 'Minimalismo', text: 'A simplicidade do sujeito e contexto força o foco no detalhe e na ação.', color: '#4285F4' },
                { part: 'Técnica', text: 'A combinação de "preto e branco" com "câmara lenta" cria um enorme impacto dramático.', color: '#EA4335' },
                { part: 'Câmara', text: 'O "super close-up" é essencial para captar a textura e o impacto da gota de água.', color: '#FBBC05' },
                { part: 'Negativo', text: 'Garante que a estética a preto e branco é respeitada, removendo qualquer cor.', color: '#5f6368' }
            ]
        },
         {
            prompt: { subject: 'uma flor de cerejeira', action: 'a desabrochar, da gema à flor completa', context: 'com o Monte Fuji desfocado ao fundo', style: 'timelapse of', camera_angle: 'a close-up shot of', camera_movement: '', lighting: 'transição da luz da manhã para a tarde', quality: 'highly detailed, realistic', negative_prompt: '' },
            analysis: [
                { part: 'Estilo', text: 'O "timelapse" é o comando principal que dita o formato do vídeo.', color: '#4285F4' },
                { part: 'Ação', text: 'A ação "da gema à flor completa" descreve o processo que o timelapse deve capturar.', color: '#EA4335' },
                { part: 'Contexto', text: 'Adicionar um fundo icónico ("Monte Fuji") enriquece a cena sem a sobrecarregar.', color: '#34A853' },
                { part: 'Iluminação', text: 'Especificar a transição da luz torna o timelapse mais dinâmico e realista.', color: '#FBBC05' }
            ]
        }
    ];

    let currentExampleIndex = 0; // Initialize current example index

    // --- CORE FUNCTIONS ---

    /**
     * Constrói a string do prompt final com base nos dados dos campos de entrada.
     * Combina sujeito, ação, contexto, estilo visual, ângulo da câmara, movimento da câmara,
     * iluminação e detalhes de qualidade, separados por vírgulas.
     * Adiciona um prompt negativo (o que evitar) no final, se preenchido.
     * A ordem das partes é otimizada para a maioria dos modelos de IA generativa de vídeo.
     */
    const buildPromptString = (promptData) => {
        let promptParts = [];
        const { subject, action, context, style, camera_angle, camera_movement, lighting, quality, negative_prompt } = promptData;

        let cameraPart = '';
        if (camera_angle && camera_movement) {
            cameraPart = `${camera_angle}, ${camera_movement}, of`;
        } else if (camera_angle) {
            cameraPart = camera_angle;
        } else if (camera_movement) {
            cameraPart = camera_movement + ' of';
        }
        if (cameraPart) promptParts.push(cameraPart.replace(' of,', ','));

        if (style && style.startsWith('timelapse')) {
             promptParts.push(style);
             if (subject) promptParts.push(subject);
        } else {
            if (subject) promptParts.push(subject);
        }

        if (action) promptParts.push(action);
        if (context) promptParts.push(context);
        if (lighting) promptParts.push(`with ${lighting} lighting`);

        if (style && !style.startsWith('timelapse')) {
            promptParts.push(style);
        }

        if (quality) promptParts.push(quality);

        let finalPrompt = promptParts.filter(part => part && part.trim() !== '').join(', ');

        if (negative_prompt) {
            finalPrompt += ` --no ${negative_prompt.replace(/,--no/g, ',')}`;
        }
        return finalPrompt;
    };

    /**
     * Analisa o prompt atual e fornece uma pontuação de "qualidade" e dicas.
     * A pontuação é baseada no preenchimento dos diferentes campos, cada um com um peso.
     * - Sujeito, Ação, Contexto: Peso maior (20 cada)
     * - Estilo Visual, Ângulo da Câmara: Peso médio (10 cada)
     * - Movimento da Câmara, Detalhes (Iluminação/Qualidade), Prompt Negativo: Peso menor (5 cada)
     * As dicas são fornecidas com base nos campos não preenchidos ou com conteúdo curto.
     * A cor da barra de progresso muda com base na pontuação (Vermelho < 40, Amarelo < 75, Verde >= 75).
     */
    const analyzePrompt = () => {
        let score = 0;
        let tips = [];
        const weights = { subject: 20, action: 20, context: 20, style: 10, camera_angle: 10, camera_movement: 5, details: 10, negative: 5 };

        if (domElements.inputs.subject.value.trim()) {
            score += weights.subject;
            if (domElements.inputs.subject.value.length < 15) tips.push('Tente um sujeito mais descritivo.');
        } else {
            tips.push('Adicione um sujeito para começar.');
        }

        if (domElements.inputs.action.value.trim()) score += weights.action;
        if (domElements.inputs.context.value.trim()) score += weights.context;
        if (domElements.inputs.style.value) score += weights.style;
        if (domElements.inputs.camera_angle.value) score += weights.camera_angle;
        if (domElements.inputs.camera_movement.value) score += weights.camera_movement;
        if (domElements.inputs.lighting.value.trim() || domElements.inputs.quality.value.trim()) score += weights.details;
        if (domElements.inputs.negative_prompt.value.trim()) score += weights.negative;

        domElements.progressBar.style.width = score + '%';
        domElements.progressBar.textContent = score > 10 ? `${score}%` : '';

        if (score < 40) domElements.progressBar.style.backgroundColor = '#EA4335';
        else if (score < 75) domElements.progressBar.style.backgroundColor = '#FBBC05';
        else domElements.progressBar.style.backgroundColor = '#34A853';

        if (tips.length > 0 && score < 100) {
            domElements.analyzerTip.textContent = '💡 Dica: ' + tips[0];
        } else if (score > 0 && score < 100) {
            domElements.analyzerTip.textContent = '👍 Bom começo! Adicione mais detalhes para refinar a sua ideia.';
        } else if (score >= 100) {
            domElements.analyzerTip.textContent = '🏆 Excelente! Este é um prompt detalhado e bem estruturado.';
        } else {
            domElements.analyzerTip.textContent = 'Preencha os campos para começar a análise.';
        }
    };

    const updatePrompt = () => {
        const currentValues = {};
        for (const key in domElements.inputs) {
            currentValues[key] = domElements.inputs[key].value;
        }
        const promptText = buildPromptString(currentValues);
        domElements.generatedPromptEl.textContent = promptText || 'Comece a preencher os campos acima...';
        analyzePrompt();
    };

    const populateForm = (promptData) => {
        for (const key in domElements.inputs) {
            domElements.inputs[key].value = promptData[key] || '';
        }
        updatePrompt();
    };

    // --- EVENT LISTENERS ---
    Object.values(domElements.inputs).forEach(input => {
        input.addEventListener('input', updatePrompt);
        input.addEventListener('change', updatePrompt);
    });

    // Event listener para o botão "Misturar Ideias"
    // Escolhe aleatoriamente entre um prompt "curado" (mais detalhado e pensado)
    // ou um prompt completamente aleatório combinando diferentes partes.
    domElements.mixerBtn.addEventListener('click', () => {
        if (Math.random() < 0.25) { // 25% chance of a spectacular mix
            const spectacularPrompt = curatedMixes[Math.floor(Math.random() * curatedMixes.length)];
            populateForm(spectacularPrompt);
        } else { // 75% chance of a random mix
            const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
            const randomPrompt = {
                subject: getRandom(mixerData.subjects),
                action: getRandom(mixerData.actions),
                context: getRandom(mixerData.contexts),
                style: getRandom(mixerData.styles),
                camera_angle: '', camera_movement: '', lighting: '', quality: '', negative_prompt: ''
            };
            populateForm(randomPrompt);
        }
    });

    // Event listener para o botão "Analisar Exemplo"
    // Cicla sequencialmente através dos exemplos predefinidos e exibe-os no modal de análise.
    domElements.exampleBtn.addEventListener('click', () => {
        const example = examples[currentExampleIndex]; // Get example by current index

        const promptText = buildPromptString(example.prompt);
        domElements.modalPromptEl.textContent = promptText;

        domElements.modalAnalysisEl.innerHTML = '';
        example.analysis.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'analysis-item';
            itemEl.innerHTML = `<strong style="background-color:${item.color};">${item.part}</strong><p>${item.text}</p>`;
            domElements.modalAnalysisEl.appendChild(itemEl);
        });

        domElements.modal.classList.add('active');

        currentExampleIndex++; // Increment index for next click
        if (currentExampleIndex >= examples.length) {
            currentExampleIndex = 0; // Reset to loop
        }
    });

    const closeModal = () => domElements.modal.classList.remove('active');
    domElements.closeModalBtn.addEventListener('click', closeModal);
    domElements.modal.addEventListener('click', (e) => {
        if (e.target === domElements.modal) closeModal();
    });

    domElements.copyBtn.addEventListener('click', () => {
        const textToCopy = domElements.generatedPromptEl.textContent;
        if (textToCopy && textToCopy !== 'Comece a preencher os campos acima...') {
            navigator.clipboard.writeText(textToCopy).then(() => {
                domElements.copyBtn.textContent = 'Copiado!';
                setTimeout(() => { domElements.copyBtn.textContent = 'Copiar'; }, 2000);
            });
        }
    });

    domElements.clearBtn.addEventListener('click', () => {
        const emptyPrompt = { subject: '', action: '', context: '', style: '', camera_angle: '', camera_movement: '', lighting: '', quality: '', negative_prompt: ''};
        populateForm(emptyPrompt);
    });

    const setCopyright = () => {
        const year = new Date().getFullYear();
        domElements.copyrightEl.textContent = `© ${year} Ricardo Carvalho. Todos os direitos reservados.`;
    };

    // --- INITIALIZATION ---
    populateForm(examples[0].prompt); // Load the first, most comprehensive example on start
    setCopyright();
});
