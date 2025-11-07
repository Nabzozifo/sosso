#!/usr/bin/env python3
"""
Visualisateur Web Interactif pour les Nombres Soussou

Ce module crée une interface web interactive pour visualiser
la décomposition des nombres soussou avec des arbres graphiques,
des animations et des explications détaillées.

Fonctionnalités:
- Interface web moderne et responsive
- Arbres de décomposition interactifs
- Animations de construction
- Explications contextuelles
- Mode comparaison
- Export des visualisations

Auteur: Assistant IA
Date: 2024
"""

import json
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time
from soussou_explanation_module import SoussouExplanationModule

class SoussouWebVisualizer:
    """Visualisateur web pour les nombres soussou."""
    
    def __init__(self, port=8080):
        print("🌐 Initialisation du Visualisateur Web Soussou...")
        self.explainer = SoussouExplanationModule()
        self.port = port
        self.server = None
        self.server_thread = None
        print("✅ Visualisateur initialisé!")
    
    def generate_html_page(self):
        """Génère la page HTML principale."""
        html_content = """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visualisateur Soussou - Décomposition des Nombres</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .input-section {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .input-group {
            display: flex;
            gap: 15px;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .input-group input {
            padding: 15px 20px;
            font-size: 1.1em;
            border: 2px solid #ddd;
            border-radius: 10px;
            width: 200px;
            text-align: center;
        }
        
        .input-group input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
        }
        
        .btn {
            padding: 15px 30px;
            font-size: 1.1em;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
        }
        
        .btn-primary {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #333;
            border: 2px solid #ddd;
        }
        
        .btn-secondary:hover {
            background: #e9ecef;
        }
        
        .results-section {
            display: none;
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .number-display {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(45deg, #f8f9fa, #e9ecef);
            border-radius: 10px;
        }
        
        .number-display .number {
            font-size: 3em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        
        .number-display .translation {
            font-size: 1.8em;
            color: #764ba2;
            font-style: italic;
        }
        
        .tabs {
            display: flex;
            margin-bottom: 20px;
            border-bottom: 2px solid #eee;
        }
        
        .tab {
            padding: 15px 25px;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
            font-weight: bold;
        }
        
        .tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
        }
        
        .tab:hover {
            background: #f8f9fa;
        }
        
        .tab-content {
            display: none;
            animation: fadeIn 0.5s ease;
        }
        
        .tab-content.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .tree-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .tree-node {
            display: inline-block;
            margin: 10px;
            padding: 15px 20px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .tree-node:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        
        .tree-level {
            margin: 20px 0;
        }
        
        .tree-connector {
            width: 2px;
            height: 20px;
            background: #ddd;
            margin: 0 auto;
        }
        
        .components-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .component-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            border-left: 5px solid #667eea;
            transition: all 0.3s ease;
        }
        
        .component-card:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .component-type {
            font-size: 0.9em;
            color: #666;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .component-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        
        .component-soussou {
            font-size: 1.2em;
            color: #764ba2;
            font-style: italic;
            margin-bottom: 10px;
        }
        
        .component-explanation {
            font-size: 0.95em;
            color: #555;
            line-height: 1.4;
        }
        
        .rules-list {
            list-style: none;
            padding: 0;
        }
        
        .rules-list li {
            background: #f8f9fa;
            margin: 10px 0;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
            transition: all 0.3s ease;
        }
        
        .rules-list li:hover {
            background: #e9ecef;
            transform: translateX(5px);
        }
        
        .construction-steps {
            counter-reset: step-counter;
        }
        
        .construction-step {
            counter-increment: step-counter;
            background: #f8f9fa;
            margin: 15px 0;
            padding: 20px;
            border-radius: 10px;
            border-left: 5px solid #17a2b8;
            position: relative;
        }
        
        .construction-step::before {
            content: counter(step-counter);
            position: absolute;
            left: -15px;
            top: 15px;
            background: #17a2b8;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .loading {
            text-align: center;
            padding: 50px;
        }
        
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #f5c6cb;
            margin: 20px 0;
        }
        
        .success {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #c3e6cb;
            margin: 20px 0;
        }
        
        .footer {
            text-align: center;
            color: white;
            margin-top: 50px;
            opacity: 0.8;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .input-group {
                flex-direction: column;
            }
            
            .input-group input {
                width: 100%;
            }
            
            .components-grid {
                grid-template-columns: 1fr;
            }
            
            .tabs {
                flex-wrap: wrap;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔢 Visualisateur Soussou</h1>
            <p>Explorez la construction des nombres en langue soussou</p>
        </div>
        
        <div class="input-section">
            <div class="input-group">
                <input type="number" id="numberInput" placeholder="Entrez un nombre" min="1" max="999999">
                <button class="btn btn-primary" onclick="analyzeNumber()">🔍 Analyser</button>
                <button class="btn btn-secondary" onclick="generateRandom()">🎲 Aléatoire</button>
                <button class="btn btn-secondary" onclick="clearResults()">🗑️ Effacer</button>
            </div>
        </div>
        
        <div id="resultsSection" class="results-section">
            <div id="numberDisplay" class="number-display">
                <div class="number" id="displayNumber"></div>
                <div class="translation" id="displayTranslation"></div>
            </div>
            
            <div class="tabs">
                <div class="tab active" onclick="showTab('tree')">🌳 Arbre</div>
                <div class="tab" onclick="showTab('components')">🧩 Composants</div>
                <div class="tab" onclick="showTab('rules')">📚 Règles</div>
                <div class="tab" onclick="showTab('construction')">🏗️ Construction</div>
            </div>
            
            <div id="treeTab" class="tab-content active">
                <h3>🌳 Arbre de Décomposition</h3>
                <div id="treeContainer" class="tree-container"></div>
            </div>
            
            <div id="componentsTab" class="tab-content">
                <h3>🧩 Composants du Nombre</h3>
                <div id="componentsContainer" class="components-grid"></div>
            </div>
            
            <div id="rulesTab" class="tab-content">
                <h3>📚 Règles Linguistiques</h3>
                <ul id="rulesList" class="rules-list"></ul>
            </div>
            
            <div id="constructionTab" class="tab-content">
                <h3>🏗️ Étapes de Construction</h3>
                <div id="constructionContainer" class="construction-steps"></div>
            </div>
        </div>
        
        <div class="footer">
            <p>🚀 Système d'inférence capable de traiter des nombres au-delà de 9999</p>
            <p>💡 Utilise des règles morphologiques avancées pour la génération automatique</p>
        </div>
    </div>
    
    <script>
        let currentData = null;
        
        function showLoading() {
            const resultsSection = document.getElementById('resultsSection');
            resultsSection.style.display = 'block';
            resultsSection.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Analyse en cours...</p>
                </div>
            `;
        }
        
        function showError(message) {
            const resultsSection = document.getElementById('resultsSection');
            resultsSection.style.display = 'block';
            resultsSection.innerHTML = `
                <div class="error">
                    <strong>❌ Erreur:</strong> ${message}
                </div>
            `;
        }
        
        function analyzeNumber() {
            const input = document.getElementById('numberInput');
            const number = parseInt(input.value);
            
            if (!number || number < 1) {
                showError('Veuillez entrer un nombre valide (≥ 1)');
                return;
            }
            
            if (number > 999999) {
                showError('Nombre trop grand (maximum: 999,999)');
                return;
            }
            
            showLoading();
            
            // Simuler un appel API
            setTimeout(() => {
                fetch(`/api/analyze?number=${number}`)
                    .then(response => response.json())
                    .then(data => {
                        currentData = data;
                        displayResults(data);
                    })
                    .catch(error => {
                        showError('Erreur lors de l\'analyse: ' + error.message);
                    });
            }, 500);
        }
        
        function generateRandom() {
            const ranges = [
                [1, 20],
                [21, 100],
                [101, 1000],
                [1001, 9999],
                [10000, 99999]
            ];
            
            const range = ranges[Math.floor(Math.random() * ranges.length)];
            const randomNumber = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
            
            document.getElementById('numberInput').value = randomNumber;
            analyzeNumber();
        }
        
        function clearResults() {
            document.getElementById('resultsSection').style.display = 'none';
            document.getElementById('numberInput').value = '';
            currentData = null;
        }
        
        function displayResults(data) {
            const resultsSection = document.getElementById('resultsSection');
            resultsSection.innerHTML = `
                <div id="numberDisplay" class="number-display">
                    <div class="number" id="displayNumber">${data.number.toLocaleString()}</div>
                    <div class="translation" id="displayTranslation">${data.translation}</div>
                    ${data.number > 9999 ? '<div style="color: #28a745; font-weight: bold; margin-top: 10px;">🚀 Nombre inféré au-delà des données d\'entraînement</div>' : ''}
                </div>
                
                <div class="tabs">
                    <div class="tab active" onclick="showTab('tree')">🌳 Arbre</div>
                    <div class="tab" onclick="showTab('components')">🧩 Composants</div>
                    <div class="tab" onclick="showTab('rules')">📚 Règles</div>
                    <div class="tab" onclick="showTab('construction')">🏗️ Construction</div>
                </div>
                
                <div id="treeTab" class="tab-content active">
                    <h3>🌳 Arbre de Décomposition</h3>
                    <div id="treeContainer" class="tree-container"></div>
                </div>
                
                <div id="componentsTab" class="tab-content">
                    <h3>🧩 Composants du Nombre</h3>
                    <div id="componentsContainer" class="components-grid"></div>
                </div>
                
                <div id="rulesTab" class="tab-content">
                    <h3>📚 Règles Linguistiques</h3>
                    <ul id="rulesList" class="rules-list"></ul>
                </div>
                
                <div id="constructionTab" class="tab-content">
                    <h3>🏗️ Étapes de Construction</h3>
                    <div id="constructionContainer" class="construction-steps"></div>
                </div>
            `;
            
            resultsSection.style.display = 'block';
            
            // Remplir les contenus
            displayTree(data);
            displayComponents(data);
            displayRules(data);
            displayConstruction(data);
        }
        
        function displayTree(data) {
            const container = document.getElementById('treeContainer');
            
            // Créer une représentation d'arbre simple
            let treeHTML = `<div class="tree-level">`;
            treeHTML += `<div class="tree-node" style="font-size: 1.2em;">${data.number} → "${data.translation}"</div>`;
            treeHTML += `</div>`;
            
            if (data.components && data.components.length > 1) {
                treeHTML += `<div class="tree-connector"></div>`;
                treeHTML += `<div class="tree-level">`;
                
                data.components.forEach(comp => {
                    treeHTML += `<div class="tree-node" title="${comp.explanation}">`;
                    treeHTML += `${comp.value} → "${comp.soussou_text}"<br>`;
                    treeHTML += `<small>${comp.component_type}</small>`;
                    treeHTML += `</div>`;
                });
                
                treeHTML += `</div>`;
            }
            
            container.innerHTML = treeHTML;
        }
        
        function displayComponents(data) {
            const container = document.getElementById('componentsContainer');
            
            if (!data.components) {
                container.innerHTML = '<p>Aucun composant disponible.</p>';
                return;
            }
            
            let componentsHTML = '';
            
            data.components.forEach(comp => {
                componentsHTML += `
                    <div class="component-card">
                        <div class="component-type">${comp.component_type}</div>
                        <div class="component-value">${comp.value}</div>
                        <div class="component-soussou">"${comp.soussou_text}"</div>
                        <div class="component-explanation">${comp.explanation}</div>
                    </div>
                `;
            });
            
            container.innerHTML = componentsHTML;
        }
        
        function displayRules(data) {
            const container = document.getElementById('rulesList');
            
            if (!data.linguistic_rules || data.linguistic_rules.length === 0) {
                container.innerHTML = '<li>Aucune règle spécifique identifiée.</li>';
                return;
            }
            
            let rulesHTML = '';
            
            data.linguistic_rules.forEach(rule => {
                rulesHTML += `<li>💡 ${rule}</li>`;
            });
            
            container.innerHTML = rulesHTML;
        }
        
        function displayConstruction(data) {
            const container = document.getElementById('constructionContainer');
            
            if (!data.construction_steps || data.construction_steps.length === 0) {
                container.innerHTML = '<p>Aucune étape de construction disponible.</p>';
                return;
            }
            
            let constructionHTML = '';
            
            data.construction_steps.forEach(step => {
                constructionHTML += `
                    <div class="construction-step">
                        ${step}
                    </div>
                `;
            });
            
            container.innerHTML = constructionHTML;
        }
        
        function showTab(tabName) {
            // Masquer tous les onglets
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Afficher l'onglet sélectionné
            document.getElementById(tabName + 'Tab').classList.add('active');
            event.target.classList.add('active');
        }
        
        // Gérer la touche Entrée
        document.getElementById('numberInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                analyzeNumber();
            }
        });
        
        // Charger un exemple au démarrage
        window.onload = function() {
            document.getElementById('numberInput').value = 1234;
            setTimeout(analyzeNumber, 1000);
        };
    </script>
</body>
</html>
        """
        
        return html_content
    
    def create_api_handler(self):
        """Crée un gestionnaire pour les requêtes API."""
        
        class APIHandler(SimpleHTTPRequestHandler):
            def __init__(self, *args, explainer=None, **kwargs):
                self.explainer = explainer
                super().__init__(*args, **kwargs)
            
            def do_GET(self):
                parsed_url = urlparse(self.path)
                
                if parsed_url.path == '/api/analyze':
                    self.handle_analyze_request(parsed_url)
                elif parsed_url.path == '/' or parsed_url.path == '/index.html':
                    self.serve_main_page()
                else:
                    self.send_error(404, "Page not found")
            
            def handle_analyze_request(self, parsed_url):
                try:
                    query_params = parse_qs(parsed_url.query)
                    number = int(query_params.get('number', [0])[0])
                    
                    if number <= 0:
                        self.send_json_error("Invalid number")
                        return
                    
                    # Analyser le nombre
                    decomposition = self.explainer.decompose_number(number)
                    
                    # Préparer la réponse
                    response_data = {
                        'number': number,
                        'translation': decomposition.soussou_translation,
                        'components': [
                            {
                                'value': comp.value,
                                'soussou_text': comp.soussou_text,
                                'component_type': comp.component_type,
                                'explanation': comp.explanation
                            }
                            for comp in decomposition.components
                        ],
                        'linguistic_rules': decomposition.linguistic_rules,
                        'construction_steps': decomposition.construction_steps,
                        'is_inference': number > 9999
                    }
                    
                    self.send_json_response(response_data)
                    
                except Exception as e:
                    self.send_json_error(f"Error analyzing number: {str(e)}")
            
            def serve_main_page(self):
                html_content = self.server.visualizer.generate_html_page()
                
                self.send_response(200)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.send_header('Content-length', len(html_content.encode('utf-8')))
                self.end_headers()
                self.wfile.write(html_content.encode('utf-8'))
            
            def send_json_response(self, data):
                json_data = json.dumps(data, ensure_ascii=False, indent=2)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Content-length', len(json_data.encode('utf-8')))
                self.end_headers()
                self.wfile.write(json_data.encode('utf-8'))
            
            def send_json_error(self, message):
                error_data = {'error': message}
                json_data = json.dumps(error_data, ensure_ascii=False)
                
                self.send_response(400)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Content-length', len(json_data.encode('utf-8')))
                self.end_headers()
                self.wfile.write(json_data.encode('utf-8'))
            
            def log_message(self, format, *args):
                # Supprimer les logs pour une sortie plus propre
                pass
        
        return APIHandler
    
    def start_server(self):
        """Démarre le serveur web."""
        try:
            # Créer le gestionnaire avec l'explainer
            handler_class = self.create_api_handler()
            
            # Créer le serveur
            self.server = HTTPServer(('localhost', self.port), 
                                   lambda *args, **kwargs: handler_class(*args, explainer=self.explainer, **kwargs))
            
            # Ajouter une référence au visualisateur
            self.server.visualizer = self
            
            print(f"🌐 Serveur démarré sur http://localhost:{self.port}")
            print("🚀 Ouverture du navigateur...")
            
            # Ouvrir le navigateur
            webbrowser.open(f'http://localhost:{self.port}')
            
            # Démarrer le serveur dans un thread séparé
            self.server_thread = threading.Thread(target=self.server.serve_forever)
            self.server_thread.daemon = True
            self.server_thread.start()
            
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors du démarrage du serveur: {e}")
            return False
    
    def stop_server(self):
        """Arrête le serveur web."""
        if self.server:
            print("🛑 Arrêt du serveur...")
            self.server.shutdown()
            self.server.server_close()
            
            if self.server_thread:
                self.server_thread.join(timeout=2)
            
            print("✅ Serveur arrêté")
    
    def run_interactive(self):
        """Lance le visualisateur en mode interactif."""
        print("\n" + "="*60)
        print("🌐 VISUALISATEUR WEB SOUSSOU")
        print("="*60)
        
        print("\n🚀 Fonctionnalités:")
        print("  • Interface web moderne et responsive")
        print("  • Arbres de décomposition interactifs")
        print("  • Visualisation des composants")
        print("  • Règles linguistiques détaillées")
        print("  • Étapes de construction")
        print("  • Support de l'inférence >9999")
        
        if not self.start_server():
            print("❌ Impossible de démarrer le serveur")
            return
        
        try:
            print(f"\n🌟 Interface disponible sur: http://localhost:{self.port}")
            print("\n📝 Instructions:")
            print("  • Entrez un nombre dans le champ de saisie")
            print("  • Cliquez sur 'Analyser' ou appuyez sur Entrée")
            print("  • Explorez les différents onglets")
            print("  • Utilisez 'Aléatoire' pour des exemples")
            
            print("\n⌨️  Commandes:")
            print("  • 'demo' - Lancer une démonstration")
            print("  • 'stats' - Afficher les statistiques")
            print("  • 'quit' - Quitter")
            
            while True:
                command = input("\n🌐 Commande (ou 'quit'): ").strip().lower()
                
                if command in ['quit', 'exit', 'q']:
                    break
                elif command == 'demo':
                    self.run_demo()
                elif command == 'stats':
                    self.show_server_stats()
                elif command == 'help':
                    self.show_help()
                else:
                    print("❓ Commande inconnue. Tapez 'help' pour l'aide.")
        
        except KeyboardInterrupt:
            print("\n\n👋 Arrêt demandé par l'utilisateur")
        
        finally:
            self.stop_server()
    
    def run_demo(self):
        """Lance une démonstration automatique."""
        print("\n🎬 DÉMONSTRATION AUTOMATIQUE")
        print("-" * 40)
        
        demo_numbers = [42, 123, 1234, 5678, 12345, 99999]
        
        for i, number in enumerate(demo_numbers, 1):
            print(f"\n📍 Exemple {i}/{len(demo_numbers)}: {number:,}")
            
            try:
                decomposition = self.explainer.decompose_number(number)
                print(f"🔤 Traduction: '{decomposition.soussou_translation}'")
                print(f"🧩 Composants: {len(decomposition.components)}")
                
                if number > 9999:
                    print("🚀 Nombre inféré (au-delà des données)")
                
                time.sleep(1)
                
            except Exception as e:
                print(f"❌ Erreur: {e}")
        
        print("\n✅ Démonstration terminée!")
        print(f"🌐 Testez ces nombres sur http://localhost:{self.port}")
    
    def show_server_stats(self):
        """Affiche les statistiques du serveur."""
        print("\n📊 STATISTIQUES DU SERVEUR")
        print("-" * 40)
        print(f"🌐 Port: {self.port}")
        print(f"🔗 URL: http://localhost:{self.port}")
        print(f"🟢 Statut: {'Actif' if self.server else 'Inactif'}")
        print(f"🧠 Module d'explication: Chargé")
        print(f"🚀 Support inférence: >9999")
    
    def show_help(self):
        """Affiche l'aide."""
        print("\n❓ AIDE DU VISUALISATEUR WEB")
        print("-" * 40)
        print("\n🌐 Interface Web:")
        print("  • Saisissez un nombre (1 à 999,999)")
        print("  • Explorez les onglets: Arbre, Composants, Règles, Construction")
        print("  • Utilisez le bouton 'Aléatoire' pour des exemples")
        
        print("\n⌨️  Commandes Console:")
        print("  • demo - Démonstration automatique")
        print("  • stats - Statistiques du serveur")
        print("  • help - Cette aide")
        print("  • quit - Quitter l'application")
        
        print("\n🌟 Fonctionnalités Uniques:")
        print("  ✅ Inférence au-delà de 9999")
        print("  ✅ Arbres de décomposition visuels")
        print("  ✅ Explications linguistiques détaillées")
        print("  ✅ Interface responsive et moderne")

def main():
    """Fonction principale."""
    print("🌐 LANCEMENT DU VISUALISATEUR WEB SOUSSOU 🌐")
    
    try:
        visualizer = SoussouWebVisualizer(port=8080)
        visualizer.run_interactive()
    except Exception as e:
        print(f"❌ Erreur lors du lancement: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()