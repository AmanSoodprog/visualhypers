// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure to create this file

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [selectedOption, setSelectedOption] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [generatedText, setGeneratedText] = useState('');

  // Navigation handler
  const navigateTo = (page) => {
    setActivePage(page);
    setSelectedOption(null);
    setShowComparison(false);
  };

  // Option selection handler
  const selectOption = (option) => {
    setSelectedOption(option);
    setShowComparison(false);
    
    // If we're on the text page, load the result text file
    if (activePage === 'text') {
      loadTextFile(option);
    }
  };

  // Load text file based on selected option
  const loadTextFile = async (option) => {
    try {
      const filename = `./images/result-${option}.txt`;
      // Using fetch to get the content of the text file
      const response = await fetch(filename);
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      setGeneratedText(text);
    } catch (error) {
      console.error('Error loading text file:', error);
      setGeneratedText('Error loading result text file.');
    }
  };

  // Toggle comparison view
  const toggleComparison = () => {
    setShowComparison(!showComparison);
    setSelectedOption(null);
  };

  // Home page component
  const HomePage = () => (
    <div className="home-container">
      <h1 className="page-title">Hyperparameter Visualization in Generative ML Models</h1>
      <p className="page-description">
        Explore how different hyperparameters affect machine learning model outputs. 
        Select one of the following demonstrations to begin.
      </p>
      <div className="card-grid">
        <DemoCard 
          title="Text Generation" 
          param="Learning Rate" 
          description="See how different learning rates affect text generation models."
          icon="📝"
          onClick={() => navigateTo('text')}
        />
        <DemoCard 
          title="Image Generation" 
          param="Optimizer" 
          description="Compare how different optimizers impact image generation quality."
          icon="🖼️"
          onClick={() => navigateTo('image')}
        />
        <DemoCard 
          title="Audio Generation" 
          param="Temperature" 
          description="Listen to audio samples generated with various temperature settings."
          icon="🔊"
          onClick={() => navigateTo('audio')}
        />
      </div>
    </div>
  );

  // Demo card component for homepage
  const DemoCard = ({ title, param, description, icon, onClick }) => (
    <div className="demo-card" onClick={onClick}>
      <div className="demo-card-icon">{icon}</div>
      <h2 className="demo-card-title">{title}</h2>
      <h3 className="demo-card-param">Hyperparameter: {param}</h3>
      <p className="demo-card-description">{description}</p>
    </div>
  );

  // Text Generation Page
  const TextPage = () => {
    const learningRates = [
      { value: '0.5', label: 'Learning Rate 0.5' },
      { value: '0.01', label: 'Learning Rate 0.01' },
      { value: '0.0001', label: 'Learning Rate 0.0001' }
    ];

    return (
      <DemoPage
        title="Text Generation"
        description="Learning rate controls how quickly a model adapts to the problem. A higher learning rate means faster learning but may overshoot optimal solutions, while a lower learning rate provides more precise results but requires more training time."
        options={learningRates}
        selectedOption={selectedOption}
        onSelectOption={selectOption}
        showComparison={showComparison}
        onToggleComparison={toggleComparison}
        renderContent={() => (
          <TextContent 
            selectedOption={selectedOption} 
            showComparison={showComparison}
            generatedText={generatedText}
          />
        )}
      />
    );
  };

  // Image Generation Page
  const ImagePage = () => {
    const optimizers = [
      { value: 'adam', label: 'Adam' },
      { value: 'sgd', label: 'SGD' },
      { value: 'rmsprop', label: 'RMSprop' }
    ];

    return (
      <DemoPage
        title="Image Generation"
        description="Optimizers determine how model weights are updated during training. Adam adapts learning rates per parameter and combines momentum, SGD is simple but may be slower to converge, while RMSprop maintains per-parameter learning rates but handles non-stationary objectives well."
        options={optimizers}
        selectedOption={selectedOption}
        onSelectOption={selectOption}
        showComparison={showComparison}
        onToggleComparison={toggleComparison}
        renderContent={() => (
          <ImageContent 
            selectedOption={selectedOption} 
            showComparison={showComparison}
          />
        )}
      />
    );
  };

  // Audio Generation Page
  const AudioPage = () => {
    const temperatures = [
      { value: 'low', label: 'Low Temperature' },
      { value: 'med', label: 'Medium Temperature' },
      { value: 'high', label: 'High Temperature' }
    ];

    return (
      <DemoPage
        title="Audio Generation"
        description="Temperature controls the randomness in audio generation. Lower values produce more predictable and conservative outputs, while higher values encourage more creativity and unexpected patterns at the risk of more artifacts or noise."
        options={temperatures}
        selectedOption={selectedOption}
        onSelectOption={selectOption}
        showComparison={showComparison}
        onToggleComparison={toggleComparison}
        renderContent={() => (
          <AudioContent 
            selectedOption={selectedOption} 
            showComparison={showComparison}
          />
        )}
      />
    );
  };

  // Generic demo page layout
  const DemoPage = ({ 
    title, 
    description, 
    options, 
    selectedOption, 
    onSelectOption, 
    showComparison, 
    onToggleComparison, 
    renderContent 
  }) => (
    <div className="demo-page">
      <div className="page-header">
        <button 
          onClick={() => navigateTo('home')}
          className="back-button"
        >
          ← Back to Home
        </button>
        <h1 className="page-title">{title}</h1>
        <p className="page-description" style={{ textAlign: 'center' }}>{description}</p>
      </div>
      
      <div className="option-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Select a hyperparameter option:</h2>
        <div className="option-buttons" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', maxWidth: '800px', margin: '0 auto' }}>
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => onSelectOption(option.value)}
              className={`option-button ${
                selectedOption === option.value ? 'selected' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
          <button
            onClick={onToggleComparison}
            className={`option-button ${showComparison ? 'selected' : ''}`}
          >
            Compare All
          </button>
        </div>
      </div>
      
      {(selectedOption || showComparison) && (
        <div className="content-display">
          {renderContent()}
        </div>
      )}
    </div>
  );

  // Component to load and display text file content
  const TextFileContent = ({ learningRate }) => {
    const [fileContent, setFileContent] = useState('Loading...');

    useEffect(() => {
      const fetchContent = async () => {
        try {
          const filename = `./images/result-${learningRate}.txt`;
          const response = await fetch(filename);
          if (!response.ok) {
            throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
          }
          const text = await response.text();
          setFileContent(text);
        } catch (error) {
          console.error('Error loading text file:', error);
          setFileContent('Error loading result text file.');
        }
      };

      fetchContent();
    }, [learningRate]);

    return <div>{fileContent}</div>;
  };

  // Text content component
  const TextContent = ({ selectedOption, showComparison, generatedText }) => {
    const textSamples = {
      '0.5': "High learning rate (0.5) tends to produce more erratic text with potential grammatical errors and less coherence between sentences.",
      '0.01': "Medium learning rate (0.01) balances coherence with creativity, producing readable text with some interesting variations.",
      '0.0001': "Low learning rate (0.0001) produces more coherent text but looses the actual context in many cases."
    };

    if (showComparison) {
      return (
        <>
          <div className="comparison-grid">
            {Object.entries(textSamples).map(([rate, text]) => (
              <div key={rate} className="comparison-item">
                <h3 className="comparison-title">Learning Rate: {rate}</h3>
                <div className="text-content">
                  {text}
                </div>
                <h3 className="result-title">Generated Result</h3>
                <div className="text-content">
                  {/* We'll need to load each file individually in comparison view */}
                  <TextFileContent learningRate={rate} />
                </div>
                <div className="validation-images">
                  <div className="validation-image-container">
                    <h4>Validation Accuracy</h4>
                    <img 
                      src={`./images/Accuracy-${rate}.jpg`} 
                      alt={`Validation Accuracy for learning rate ${rate}`}
                      className="validation-image"
                    />
                  </div>
                  <div className="validation-image-container">
                    <h4>Validation Loss</h4>
                    <img 
                      src={`./images/loss-${rate}.jpg`} 
                      alt={`Validation loss for learning rate ${rate}`}
                      className="validation-image"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Combined Graphs Section - Now completely separate from comparison grid */}
          <div style={{ 
            position: 'relative',
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginTop: '60px',
            marginBottom: '60px',
            padding: '0 20px',
            boxSizing: 'border-box'
          }}>
            <div style={{ 
              width: '100%', 
              maxWidth: '1200px', 
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', 
              borderRadius: '10px',
              padding: '30px',
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0'
            }}>
              <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '30px',
                fontSize: '2rem',
                color: '#333',
                fontWeight: 'bold'
              }}>Combined Graphs</h2>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '30px'
              }}>
                <div style={{ 
                  flex: '1 1 45%', 
                  minWidth: '350px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Combined Validation Accuracy</h3>
                  <img 
                    src="./images/combined-accuracy.jpg" 
                    alt="Combined validation accuracy for all learning rates"
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      maxHeight: '450px',
                      objectFit: 'contain',
                      borderRadius: '6px',
                      boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>
                <div style={{ 
                  flex: '1 1 45%', 
                  minWidth: '350px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Combined Validation Loss</h3>
                  <img 
                    src="./images/combined-loss.jpg" 
                    alt="Combined validation loss for all learning rates"
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      maxHeight: '450px',
                      objectFit: 'contain',
                      borderRadius: '6px',
                      boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="single-content">
        <h3 className="content-title">Learning Rate: {selectedOption}</h3>
        <p className="text-content">{textSamples[selectedOption]}</p>
        
        <h3 className="result-title">Generated Result</h3>
        <p className="text-content">{generatedText}</p>
        
        <div className="validation-images">
          <div className="validation-image-container">
            <h4>Validation Accuracy</h4>
            <img 
              src={`./images/Accuracy-${selectedOption}.jpg`} 
              alt={`Validation Accuracy for learning rate ${selectedOption}`}
              className="validation-image"
            />
          </div>
          <div className="validation-image-container">
            <h4>Validation Loss</h4>
            <img 
              src={`./images/loss-${selectedOption}.jpg`} 
              alt={`Validation loss for learning rate ${selectedOption}`}
              className="validation-image"
            />
          </div>
        </div>
      </div>
    );
  };

  // Image content component
  const ImageContent = ({ selectedOption, showComparison }) => {
    const optimizerDescriptions = {
      'adam': "Images generated with Adam optimizer typically show better detail and faster convergence to a realistic image. Notice the sharper edges and more defined features.",
      'sgd': "SGD optimizer produces images with more gradient-like transitions. The convergence is slower, often resulting in slightly blurrier features but sometimes more natural-looking textures.",
      'rmsprop': "RMSprop tends to balance detail and smoothness. You may notice more consistent quality across different parts of the image compared to other optimizers."
    };

    // Modified to handle multiple images per optimizer
    const renderOptimizerImages = (optimizer) => {
      return (
        <div className="image-grid">
          {[1, 2, 3].map((num) => (
            <div key={`${optimizer}${num}`} className="image-item">
              <h4>Sample {num}</h4>
              <img 
                src={`./images/${optimizer}${num}.jpg`} 
                alt={`${optimizer.toUpperCase()} optimizer sample ${num}`}
                className="optimizer-image"
              />
            </div>
          ))}
        </div>
      );
    };

    if (showComparison) {
      return (
        <div className="comparison-grid">
          {['adam', 'sgd', 'rmsprop'].map(optimizer => (
            <div key={optimizer} className="comparison-item">
              <h3 className="comparison-title">Optimizer: {optimizer.toUpperCase()}</h3>
              {renderOptimizerImages(optimizer)}
              <p className="image-description">{optimizerDescriptions[optimizer]}</p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="single-content">
        <h3 className="content-title">Optimizer: {selectedOption.toUpperCase()}</h3>
        <div className="single-optimizer-images">
          {renderOptimizerImages(selectedOption)}
        </div>
        <p className="image-description">{optimizerDescriptions[selectedOption]}</p>
      </div>
    );
  };

  // Audio content component
  const AudioContent = ({ selectedOption, showComparison }) => {
    const getAudioDescription = (temp) => {
      const descriptions = {
        'low': "Low temperature produces more predictable audio with fewer variations. The melody follows expected patterns and there are minimal unexpected notes or sounds. The output is clean but may sound more mechanical or less creative.",
        'med': "Medium temperature strikes a balance between predictability and creativity. The audio contains interesting variations while maintaining an overall coherent structure. This setting often produces the most musically pleasing results.",
        'high': "High temperature creates highly varied and sometimes unexpected audio. The output is more creative and can discover novel patterns, but may also include more artifacts or dissonant sounds. This setting pushes boundaries but risks coherence."
      };
      return descriptions[temp];
    };

    const renderAudioWithAnalysis = (temp) => {
      return (
        <div className="audio-analysis-container">
          <div className="audio-container">
            <audio controls className="audio-player">
              <source src={`./images/${temp}.wav`} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
          
          <div className="audio-visualizations">
            <div className="visualization-item">
              <h4>Spectrogram</h4>
              <img 
                src={`./images/spec${temp}.jpg`} 
                alt={`Spectrogram for ${temp} temperature audio`}
                className="audio-visualization-image"
              />
            </div>
            <div className="visualization-item">
              <h4>Note Variance</h4>
              <img 
                src={`./images/var${temp}.jpg`} 
                alt={`Note variance graph for ${temp} temperature audio`}
                className="audio-visualization-image"
              />
            </div>
          </div>
          
          <p className="audio-description">{getAudioDescription(temp)}</p>
        </div>
      );
    };

    if (showComparison) {
      return (
        <div className="comparison-grid">
          {['low', 'med', 'high'].map(temp => (
            <div key={temp} className="comparison-item">
              <h3 className="comparison-title">Temperature: {temp}</h3>
              {renderAudioWithAnalysis(temp)}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="single-content">
        <h3 className="content-title">Temperature: {selectedOption}</h3>
        {renderAudioWithAnalysis(selectedOption)}
      </div>
    );
  };

  // Render the appropriate page based on state
  const renderPage = () => {
    switch (activePage) {
      case 'text':
        return <TextPage />;
      case 'image':
        return <ImagePage />;
      case 'audio':
        return <AudioPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-container">
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-logo"></div>
          <div className="nav-links">
            <button 
              onClick={() => navigateTo('home')}
              className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => navigateTo('text')}
              className={`nav-link ${activePage === 'text' ? 'active' : ''}`}
            >
              Text
            </button>
            <button 
              onClick={() => navigateTo('image')}
              className={`nav-link ${activePage === 'image' ? 'active' : ''}`}
            >
              Image
            </button>
            <button 
              onClick={() => navigateTo('audio')}
              className={`nav-link ${activePage === 'audio' ? 'active' : ''}`}
            >
              Audio
            </button>
          </div>
        </div>
      </nav>
      <main className="main-content">
        {renderPage()}
      </main>
      <footer className="main-footer">
        <div className="footer-content">
          ML Hyperparameter Effect Demonstration © 2025
        </div>
      </footer>
    </div>
  );
};

export default App;