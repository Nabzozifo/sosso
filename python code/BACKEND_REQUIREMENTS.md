# Backend Requirements - Soussou Number Conversion System

## 📋 Overview

This document outlines the comprehensive backend requirements for the Soussou Number Conversion System, a sophisticated linguistic application that converts numbers to the Soussou language with detailed morphological explanations.

## 🏗️ System Architecture

### Core Components

1. **FastAPI Web Server** (`soussou_api.py`)
   - RESTful API endpoints
   - CORS middleware configuration
   - Request/response validation
   - Error handling and HTTP status codes

2. **Soussou Explanation Module** (`soussou_explanation_module.py`)
   - Core linguistic processing engine
   - Morphological rule extraction
   - Number decomposition and analysis
   - Visual tree generation

3. **Enhanced Explanation System** (`enhanced_soussou_explanation.py`)
   - Advanced morphological analysis
   - Construction step generation
   - Detailed linguistic explanations

4. **Number Converter** (Integrated in API)
   - Multi-format number conversion
   - Rule-based generation system
   - Training data integration

## 🌐 API Endpoints

### Core Conversion Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/` | API information and status | None |
| `POST` | `/convert` | Convert number to Soussou | `number`, `format_type` |
| `GET` | `/convert/{number}` | Convert number (GET method) | `number`, `format_type` (query) |
| `GET` | `/random` | Generate random number with translation | None |
| `GET` | `/formats` | Available format information | None |

### Explanation Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `POST` | `/explain` | Basic number explanation | `number` |
| `POST` | `/explain-enhanced` | Enhanced morphological explanation | `number` |
| `GET` | `/morphological-tree/{number}` | Morphological tree structure | `number` |

## 📊 Data Models

### Request Models (Pydantic)

```python
class NumberRequest(BaseModel):
    number: int
    format_type: str = "linguistic"  # "linguistic" or "dataset"

class ExplainRequest(BaseModel):
    number: int
```

### Response Models (Pydantic)

```python
class NumberResponse(BaseModel):
    number: int
    soussou: str
    format: str
    source: str
    explanation: str
    tree_structure: dict
```

### Data Classes

```python
@dataclass
class NumberComponent:
    value: int
    soussou_text: str
    component_type: str
    rule_applied: str
    explanation: str

@dataclass
class DecompositionTree:
    number: int
    soussou_translation: str
    components: List[NumberComponent]
    construction_steps: List[str]
    linguistic_rules: List[str]

@dataclass
class MorphologicalNode:
    value: int
    soussou_text: str
    morpheme_type: str
    position: str
    level: int
    rule_id: str
    explanation: str
    children: List['MorphologicalNode']

@dataclass
class ConstructionStep:
    step_number: int
    action: str
    component: str
    value: str
    result: str
    rule_applied: str
    child_explanation: str
    visual_icon: str
```

## 📦 Dependencies

### Core Web Framework
- **FastAPI** `0.115.6` - Modern web framework for APIs
- **Uvicorn** `0.32.1` - ASGI server implementation
- **Pydantic** `2.10.4` - Data validation and serialization
- **Pydantic-settings** `2.7.0` - Settings management

### Machine Learning & NLP
- **PyTorch** `2.5.1` - Deep learning framework
- **Transformers** `4.48.0` - Hugging Face transformers
- **Tokenizers** `0.21.0` - Fast tokenization library
- **SACREBLEU** `2.4.3` - Machine translation evaluation
- **NLTK** `3.9.1` - Natural language processing toolkit
- **SciPy** `1.13.1` - Scientific computing library

### Data Processing
- **Pandas** `2.2.3` - Data manipulation and analysis
- **NumPy** `>=1.23.5,<2.3` - Numerical computing
- **OpenPyXL** `3.1.5` - Excel file processing
- **Scikit-learn** `>=1.3.0` - Machine learning library
- **EditDistance** `>=0.6.0` - String distance calculations

### Utilities
- **Loguru** `0.7.3` - Advanced logging
- **AIOFiles** `24.1.0` - Asynchronous file operations
- **Python-multipart** `0.0.20` - Multipart form data parsing

### Development & Testing
- **Pytest** `8.3.4` - Testing framework
- **Pytest-asyncio** `0.24.0` - Async testing support
- **HTTPx** `0.28.1` - HTTP client for testing

### Monitoring & Processing
- **Prometheus-client** `0.21.1` - Metrics collection
- **SentencePiece** `0.2.0` - Text tokenization
- **Regex** `2024.11.6` - Regular expressions

## 🔧 Configuration Requirements

### Environment Variables
- `HOST`: Server host (default: "0.0.0.0")
- `PORT`: Server port (default: 8000)
- `CSV_PATH`: Path to Soussou numbers dataset
- `LOG_LEVEL`: Logging level (default: "INFO")

### CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 💾 Data Requirements

### Primary Dataset
- **File**: `nombres_soussou_1_9999.csv`
- **Format**: CSV with number-to-Soussou mappings
- **Range**: Numbers 1-9999
- **Columns**: Number, Soussou translation

### Morphological Rules
- Base number morphemes (1-9)
- Structural markers (ten, hundred, thousand, etc.)
- Linguistic patterns and connectors
- Rule extraction from training data

## 🚀 Performance Requirements

### Response Time
- Number conversion: < 100ms
- Basic explanation: < 200ms
- Enhanced explanation: < 500ms
- Morphological tree: < 300ms

### Scalability
- Support for concurrent requests
- Stateless design for horizontal scaling
- Efficient memory usage for large numbers

### Accuracy
- 100% accuracy for numbers 1-9999 (training data)
- Consistent rule application for numbers > 9999
- Morphological rule compliance

## 🔒 Security Requirements

### Input Validation
- Number range validation (1 to 999,999)
- Format type validation ("linguistic" or "dataset")
- Request size limits
- SQL injection prevention

### Error Handling
- Graceful error responses
- No sensitive information exposure
- Proper HTTP status codes
- Logging of security events

## 🧪 Testing Requirements

### Unit Tests
- Individual component testing
- Morphological rule validation
- Number conversion accuracy
- API endpoint functionality

### Integration Tests
- End-to-end API testing
- Database integration
- External service integration
- Performance benchmarking

### Test Coverage
- Minimum 80% code coverage
- Critical path testing
- Edge case validation
- Error scenario testing

## 📈 Monitoring & Logging

### Metrics Collection
- Request/response times
- Error rates and types
- Resource utilization
- User interaction patterns

### Logging Requirements
- Structured logging with Loguru
- Request/response logging
- Error tracking and alerting
- Performance monitoring

## 🔄 Deployment Requirements

### Server Requirements
- Python 3.11+
- Minimum 2GB RAM
- 1GB storage space
- Network connectivity

### Container Support
- Docker containerization
- Environment variable configuration
- Health check endpoints
- Graceful shutdown handling

### Production Considerations
- Load balancing support
- Database connection pooling
- Caching mechanisms
- Backup and recovery procedures

## 📚 Documentation Requirements

### API Documentation
- OpenAPI/Swagger integration
- Endpoint descriptions
- Request/response examples
- Error code documentation

### Code Documentation
- Inline code comments
- Module-level documentation
- Function/class docstrings
- Architecture diagrams

## 🔮 Future Enhancements

### Planned Features
- Multi-language support
- Voice synthesis integration
- Advanced visualization tools
- Machine learning model integration

### Scalability Considerations
- Microservices architecture
- Database optimization
- Caching strategies
- CDN integration

---

*This document serves as the comprehensive backend requirements specification for the Soussou Number Conversion System. It should be updated as the system evolves and new requirements emerge.*