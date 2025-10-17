const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; 

// --- Variáveis de Estado em Memória ---
let checkCounts = {
    email: 0,
    password: 0
};
// Novo array para salvar os e-mails digitados.
let savedEmails = []; 
// -------------------------------------

app.use(cors());
app.use(express.json());
// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// NOVO: Rota para a página de Administração
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});


// Rota GET para obter o valor atual dos contadores
app.get('/api/counts', (req, res) => {
    res.json(checkCounts);
});

// NOVO: Rota GET para obter a lista de e-mails
app.get('/api/emails', (req, res) => {
    // Retorna a lista de e-mails do mais recente para o mais antigo
    res.json({
        total: savedEmails.length,
        emails: savedEmails.slice().reverse() 
    });
});


// Rota POST para incrementar APENAS o contador de Email
app.post('/api/counts/email', (req, res) => {
    checkCounts.email += 1;
    // Salva o email se for enviado no corpo da requisição (novo)
    if (req.body.email) {
        savedEmails.push(req.body.email);
        console.log(`[E-MAIL SALVO] Novo email: ${req.body.email}`);
    }
    console.log(`[E-MAIL COUNT] Novo valor: ${checkCounts.email}`);
    res.json({ email: checkCounts.email });
});

// Rota POST para incrementar APENAS o contador de Senha (sem lista de emails)
app.post('/api/counts/password', (req, res) => {
    checkCounts.password += 1;
    console.log(`[PASSWORD COUNT] Novo valor: ${checkCounts.password}`);
    res.json({ password: checkCounts.password });
});

// Rota POST para incrementar AMBOS os contadores
app.post('/api/counts/both', (req, res) => {
    checkCounts.email += 1;
    checkCounts.password += 1;
    // Salva o email se for enviado no corpo da requisição (novo)
    if (req.body.email) {
        savedEmails.push(req.body.email);
        console.log(`[E-MAIL SALVO] Novo email: ${req.body.email}`);
    }
    console.log(`[BOTH COUNT] E: ${checkCounts.email}, P: ${checkCounts.password}`);
    res.json({ email: checkCounts.email, password: checkCounts.password });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Contadores iniciais: E:${checkCounts.email}, P:${checkCounts.password}. E-mails salvos: ${savedEmails.length}`);
    console.log(`Acesse a página de administração em http://localhost:${PORT}/admin`);
});