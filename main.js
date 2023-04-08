        
        const commonWordsEnglish = ['a', 'an', 'the', 'in', 'on', 'at', 'for', 'with', 'about', 'is', 'and', 'of', 'to', 'as'];
        const commonWordsSpanish = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'en', 'de', 'con', 'para', 'sobre', 'por', 'y'];
        const commonWordsFrench = ['le', 'la', 'les', 'un', 'une', 'des', 'en', 'dans', 'sur', 'avec', 'pour', 'de', 'et', 'à'];
        const commonWordsGerman = ['der', 'die', 'das', 'in', 'auf', 'an', 'für', 'mit', 'über', 'ist', 'und', 'von', 'zu', 'als'];

        const language = 'english'; // Set the language here (english, spanish, french, german)

        function getCommonWords(language) {
          switch (language) {
            case 'spanish':
            return commonWordsSpanish;
            case 'french':
            return commonWordsFrench;
            case 'german':
            return commonWordsGerman;
            default:
            return commonWordsEnglish;
            }
          }
        
          function isCommonWord(word) {
          const commonWords = getCommonWords(language);
          return commonWords.includes(word.toLowerCase());
           }
    
        function getBoldClass(word) {
          const length = word.length;
          if (length <= 3) {
            return 'bold-low';
          } else if (length <= 5) {
            return 'bold-medium';
          } else {
            return 'bold-high';
          }
        }
          async function loadPdfFile(event) {
            try {
              const file = event.target.files[0];
              if (!file) return;
        
              // Load the PDF file
              const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file));
              const pdf = await loadingTask.promise;
        
              let fullText = '';
        
             // Extract text from each page of the PDF
              for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
              const page = await pdf.getPage(pageNum);
              const content = await page.getTextContent();

              let prevY = content.items[0].transform[5];
              const textItems = content.items.map((item) => {
              const currentY = item.transform[5];
              const lineBreak = Math.abs(currentY - prevY) > 10 ? '\n' : ' ';
              prevY = currentY;
              return lineBreak + item.str;
              });

              fullText += textItems.join('') + '\n';
              }
        
              // Set the extracted text as the value of the input element
              document.getElementById('inputText').value = fullText;
             formatText();
             formatText2();
              }catch (error) {
              console.error('Error loading the PDF file:', error);
              alert(`An error occurred while loading the PDF file: ${error.message}`);
            }
          }
          
          function calculateFontSize(wordCount) {
            if (wordCount <= 100) {
              return '20px';
            } else if (wordCount <= 500) {
              return '18px';
            } else {
              return '13px';
            }
          }
          
          function calculateFontSize(wordCount) {
            let baseFontSize;
          
            // Check screen size and set the base font size
            if (window.innerWidth >= 1200) {
              baseFontSize = 26;
            } else if (window.innerWidth >= 768) {
              baseFontSize = 22;
            } else if (window.innerWidth >= 576) {
              baseFontSize = 18;
            } else {
              baseFontSize = 16;
            }
          
            if (wordCount <= 100) {
              return (baseFontSize + 8) + 'px';
            } else if (wordCount <= 500) {
              return (baseFontSize + 6) + 'px';
            } else {
              return baseFontSize + 'px';
            }
          }
          
      
          
          function downloadBionicPdf(pageSize = 'letter') {
            const outputText = document.getElementById('outputText');
            const wordCount = outputText.textContent.trim().split(/\s+/).length;
            const fontSize = calculateFontSize(wordCount, pageSize);
            
            if (outputText.textContent.trim() === '') {
              alert('No hay contenido disponible para descargar.');
              return;
            }
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = outputText.innerHTML.replaceAll('\n', '<br>').replaceAll('  ', '&nbsp; ');
            tempDiv.style.maxWidth = pageSize === 'a4' ? '595px' : '612px';
            tempDiv.style.margin = '0 auto';
            tempDiv.style.whiteSpace = 'pre-wrap';
            tempDiv.style.overflowWrap = 'break-word';
            tempDiv.style.wordWrap = 'break-word';
            tempDiv.style.lineHeight = '1.6';
            tempDiv.style.fontSize = fontSize;
          
            const opt = {
              margin: [20, 20, 20, 20],
              filename: 'Bionic-Reading.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: 'pt', format: pageSize, orientation: 'portrait' },
            };
        
            html2pdf().set(opt).from(tempDiv).save();
            
          }
          
          
          
          function formatText() {
            const inputText = document.getElementById('inputText').value;
            const words = inputText.split(' ');
    
            let formattedWords = words.map(word => {
            if (isCommonWord(word)) {
              return word;
            }
    
            const boldLettersCount = Math.ceil(word.length / 2);
            const boldPart = word.slice(0, boldLettersCount);
            const regularPart = word.slice(boldLettersCount);
            const boldClass = getBoldClass(word);
    
            return `<span class="${boldClass}">${boldPart}</span>${regularPart}`;
            });
    
            document.getElementById('outputText').innerHTML = formattedWords.join(' ');
          }
          function formatText2() {
            const inputText = document.getElementById("inputText");
            const outputText = document.getElementById("outputText");
            const wordCount = document.getElementById("wordCount");

            const words = inputText.value.trim().split(/\s+/);
            const wordCountValue = words.length > 0 && words[0] !== "" ? words.length : 0;
             wordCount.textContent = `Word count: ${wordCountValue}`;
          }

          function fullscreenBtnClick() {
            localStorage.setItem('outputText', document.getElementById('outputText').innerHTML);
            window.open('fullscreen.html');
          }
          
          const fullscreenBtn = document.getElementById('fullscreenBtn');
          fullscreenBtn.addEventListener('click', fullscreenBtnClick);

          //fullscreen.html
          localStorage.setItem('outputText', document.getElementById('outputText').innerHTML);

          



