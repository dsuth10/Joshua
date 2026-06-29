window.MCS = window.MCS || {};

MCS.questionPicker = {
    /**
     * Generates a stable string key for a concrete question instance.
     * Uses `instanceKey` if provided by the generator, otherwise falls back to prompt text.
     */
    fingerprint(q) {
        if (!q) return '';
        const instanceKey = q.instanceKey || q.prompt;
        return `${q.context}::${instanceKey}`;
    },

    /**
     * Picks a question from a generator function, avoiding session repeats.
     * @param {Function} generateFn - The generator function that returns a question object.
     * @param {Set} sessionSeen - A Set of fingerprints seen this session.
     * @param {number} maxAttempts - Maximum rerolls before giving up.
     */
    pick(generateFn, sessionSeen, maxAttempts = 24) {
        let attempts = 0;
        let q = null;
        let fp = '';

        do {
            q = generateFn();
            fp = this.fingerprint(q);
            attempts++;
        } while (sessionSeen.has(fp) && attempts < maxAttempts);

        if (fp) sessionSeen.add(fp);
        return q;
    },

    /**
     * Picks a question from an array of generator functions, avoiding session repeats.
     * @param {Array<Function>} poolArray - Array of generator functions.
     * @param {Set} sessionSeen - A Set of fingerprints seen this session.
     * @param {number} maxAttempts - Maximum rerolls before giving up.
     */
    pickFromPool(poolArray, sessionSeen, maxAttempts = 24) {
        if (!poolArray || poolArray.length === 0) return null;
        if (poolArray.length === 1) {
            const q = poolArray[0]();
            sessionSeen.add(this.fingerprint(q));
            return q;
        }

        let attempts = 0;
        let q = null;
        let fp = '';

        do {
            const generateFn = poolArray[Math.floor(Math.random() * poolArray.length)];
            q = generateFn();
            fp = this.fingerprint(q);
            attempts++;
        } while (sessionSeen.has(fp) && attempts < maxAttempts);

        if (fp) sessionSeen.add(fp);
        return q;
    },

    // --- Deck Manager for Static MCQs (Slice 3) ---

    getDeckState(context) {
        try {
            const stored = localStorage.getItem('joshua_math_deck_state');
            const state = stored ? JSON.parse(stored) : {};
            return state[context] || { drawnIndex: 0, order: [] };
        } catch (e) {
            return { drawnIndex: 0, order: [] };
        }
    },

    saveDeckState(context, stateObj) {
        try {
            const stored = localStorage.getItem('joshua_math_deck_state');
            const state = stored ? JSON.parse(stored) : {};
            state[context] = stateObj;
            localStorage.setItem('joshua_math_deck_state', JSON.stringify(state));
        } catch (e) {
            console.warn('Failed to save deck state', e);
        }
    },

    /**
     * Draws a variant from a shuffled deck, ensuring a full cycle before repeats.
     * State is persisted across sessions in localStorage.
     * @param {string} context - The curriculum context to isolate the deck state.
     * @param {Array} variantsArray - The finite array of options/questions.
     */
    shuffleDeck(context, variantsArray) {
        if (!variantsArray || variantsArray.length === 0) return null;
        if (variantsArray.length === 1) return variantsArray[0];

        let state = this.getDeckState(context);
        
        if (!state.order || state.order.length !== variantsArray.length) {
            state.order = Array.from({ length: variantsArray.length }, (_, i) => i);
            for (let i = state.order.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [state.order[i], state.order[j]] = [state.order[j], state.order[i]];
            }
            state.drawnIndex = 0;
        }

        const pickedIndex = state.order[state.drawnIndex];
        const pickedVariant = variantsArray[pickedIndex];

        state.drawnIndex++;
        if (state.drawnIndex >= state.order.length) {
            for (let i = state.order.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [state.order[i], state.order[j]] = [state.order[j], state.order[i]];
            }
            state.drawnIndex = 0;
        }

        this.saveDeckState(context, state);
        return pickedVariant;
    }
};
