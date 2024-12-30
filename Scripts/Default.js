// Created: Cian McNamara, 2024

// Contains the names of each form section as follows:
//      Block Name: {
//          Module Name: [
//              { name: 'Assessment Name', weight: 0.5 } // weight is saying how much of the module it is worth       
//          ]
//      }
const formSections = {
    'Block 1.1': {
        'Introduction to Programming': [
            { name: 'Mid-term 1', weight: 1 / 3 },
            { name: 'Mid-term 2', weight: 2 / 3 },
        ],
        'Computer Organisation and Architecture': [
            { name: 'Mid-term', weight: 1.0 },
        ],
        'HILT': [
            { name: 'CV', weight: 0.5 },
            { name: 'Reflective Survey', weight: 0.5 }
        ],
        'IGNITE': [
            { name: 'IGNITE Week 1', weight: 1 / 8 },
            { name: 'IGNITE Week 2', weight: 1 / 8 },
            { name: 'IGNITE Week 3', weight: 1 / 8 },
            { name: 'IGNITE Week 4', weight: 1 / 8 },
            { name: 'IGNITE Week 5', weight: 1 / 8 },
            { name: 'IGNITE Week 6', weight: 1 / 8 },
            { name: 'IGNITE Week 7', weight: 1 / 8 },
            { name: 'IGNITE Week 8', weight: 1 / 8 },
        ],
        'Joint Assessment': [
            { name: 'Project', weight: 1.0 }
        ]
    },
    'Block 1.2': {
        'Object Oriented Programming': [
            { name: 'Assessment 1', weight: 1 / 3 },
            { name: 'Assessment 2', weight: 1 / 3 },
            { name: 'Assessment 3', weight: 1 / 3 }
        ],
        'Maths': [
            { name: 'Assessment 1', weight: 0.25 },
            { name: 'Assessment 2', weight: 0.25 },
            { name: 'Assessment 3', weight: 0.5 }
        ],
        'Innovation': [
            { name: 'Innovation Portfolio', weight: 0.5 },
            { name: 'Skunkworks', weight: 0.5 }
        ],
        'EPIC': [
            { name: 'Project', weight: 1.0 }
        ]
    }
};

// Contains the weight of each module for its block
const moduleWeights = {
    'Introduction to Programming': 0.24,
    'Computer Organisation and Architecture': 0.24,
    'HILT': 0.1,
    'IGNITE': 0.1,
    'Joint Assessment': 0.32,
    'Object Oriented Programming': 0.3,
    'Maths': 0.3,
    'Innovation': 0.1,
    'EPIC': 0.3,
};

// Given a percentage, returns the correct QCA value
function calculateQCA(percentage) {
    if (percentage >= 80) { return 4.00; }
    else if (percentage >= 72) { return 3.60; }
    else if (percentage >= 64) { return 3.20; }
    else if (percentage >= 60) { return 3.00; }
    else if (percentage >= 56) { return 2.80; }
    else if (percentage >= 52) { return 2.60; }
    else if (percentage >= 48) { return 2.40; }
    else if (percentage >= 40) { return 2.00; }
    else if (percentage >= 35) { return 1.60; }
    else if (percentage >= 30) { return 1.20; }
    else { return 0.00; }
}

// I couldn't figure out how to set up react for an ASP.NET project.
// 
// Creates the input field for the given assessment
function createInputField(assessment) {
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    const labelElement = document.createElement('label');
    // Multiply by 100 to quickly convert to percentage
    labelElement.innerHTML = `${assessment.name} <span class="weight-label">(${Math.round(assessment.weight * 100)}%)</span>`;

    // Set up the clicky buttons for the number inputs
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '100';
    input.placeholder = 'Enter grade (0-100)';
    input.dataset.weight = assessment.weight;

    // When the input element gets updated this function will run
    input.addEventListener('input', function () {
        const value = this.value;

        // Throw an error and show the error screen if someone inputs a number outside of the range
        if (value < 0 || value > 100) {
            inputGroup.classList.add('error');
            const existingError = inputGroup.querySelector('.error-message');

            if (!existingError) {
                const errorMessage = document.createElement('div');

                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Please enter a grade between 0 and 100';

                inputGroup.appendChild(errorMessage);
            }
        } else {
            // When the input is done correctly remove the error screen and update the results
            inputGroup.classList.remove('error');
            const errorMessage = inputGroup.querySelector('.error-message');

            if (errorMessage) {
                errorMessage.remove();
            }

            updateResults();
        }
    });

    inputGroup.appendChild(labelElement);
    inputGroup.appendChild(input);

    return inputGroup;
}

// Create the results area for the individual blocks and bind them to a block number
function createBlockResultsArea(blockId) {
    const resultsArea = document.createElement('div');
    resultsArea.className = 'block-results-area';

    resultsArea.innerHTML = `
        <div class="results-grid">
            <div class="result-box">
                <div class="result-label">Block QCA</div>
                <div class="result-value" id="qca-value-${blockId}">0.00</div>
            </div>
            <div class="result-box">
                <div class="result-label">Block Percentage</div>
                <div class="result-value" id="percentage-value-${blockId}">0%</div>
            </div>
        </div>
    `;

    return resultsArea;
}

// Create the section for a given block and populate it with the modules
function createSection(title, assessments) {
    const section = document.createElement('div');
    section.className = 'section';

    // Create the drop down for the block
    const header = document.createElement('button');
    header.className = 'section-header';
    header.type = 'button';
    // Add the chevron to the drop down
    header.innerHTML = `${title}<span class="chevron"></span>`;

    // Create the content area for the block which holds the modules
    const content = document.createElement('div');
    content.className = 'section-content';

    // Names are out of date here, the assessments are actually modules as this was originally designed
    // before I allowed multi-block support.
    if (typeof assessments === 'object' && !Array.isArray(assessments)) {
        Object.entries(assessments).forEach(([moduleTitle, moduleAssessments]) => {
            const moduleSection = createModuleSection(moduleTitle, moduleAssessments);
            content.appendChild(moduleSection);
        });

        // Remove spaces in block name, add a dash in place of the space and make it completely lowercase.
        const blockId = title.replace(/\s+/g, '-').toLowerCase();
        const blockResults = createBlockResultsArea(blockId);
        content.appendChild(blockResults);
    } else {
        assessments.forEach(assessment => {
            content.appendChild(createInputField(assessment));
        });
    }

    header.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        content.classList.toggle('active');
        header.classList.toggle('active');
        section.classList.toggle('active');
    });

    section.appendChild(header);
    section.appendChild(content);
    return section;
}

function createModuleSection(title, assessments) {
    const moduleSection = document.createElement('div');
    moduleSection.className = 'module-section';

    // Create the dropdown for the module
    const moduleHeader = document.createElement('button');
    moduleHeader.className = 'module-header';
    moduleHeader.type = 'button';
    moduleHeader.innerHTML = `${title}<span class="chevron"></span>`;

    const moduleContent = document.createElement('div');
    moduleContent.className = 'section-content';

    // Put all the assessments in
    assessments.forEach(assessment => {
        moduleContent.appendChild(createInputField(assessment));
    });


    moduleHeader.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        moduleContent.classList.toggle('active');
        moduleHeader.classList.toggle('active');
        moduleSection.classList.toggle('active');
    });

    // Add the dropdown and content sections of the module to the section the block the module is in
    moduleSection.appendChild(moduleHeader);
    moduleSection.appendChild(moduleContent);
    return moduleSection;
}

// Does as it says on the tin
function updateResults() {
    const blocks = document.querySelectorAll('.section');

    let totalWeightedScore = 0;
    let totalWeights = 0;

    // Go through each block and calculate the weighted score
    blocks.forEach(block => {
        // Get the title of the block and the id of the block
        const blockTitle = block.querySelector('.section-header').textContent.replace(/\s*chevron\s*$/, '').trim();
        const blockId = blockTitle.replace(/\s+/g, '-').toLowerCase();

        // Get all the modules in the block
        const moduleSections = block.querySelectorAll('.module-section');

        let blockScore = 0;
        let blockWeights = 0;

        // Go through every module in the block and calculate the weighted score
        moduleSections.forEach(moduleSection => {
            // Get the module title and weight
            const moduleTitle = moduleSection.querySelector('.module-header').textContent.replace(/\s*chevron\s*$/, '').trim();
            const moduleWeight = moduleWeights[moduleTitle] || 0; // i dont trust myself

            const inputs = moduleSection.querySelectorAll('.input-group input');

            let moduleScore = 0;
            let validInputsCount = 0;

            // Go through each assessment in the module and calculate the weighted score
            inputs.forEach(input => {
                const value = parseFloat(input.value);
                const assessmentWeight = parseFloat(input.dataset.weight);

                // Calculate the module score and increment the valid inputs count
                if (!isNaN(value) && value >= 0 && value <= 100) {
                    moduleScore += value * assessmentWeight;
                    validInputsCount++;
                }
            });

            // If there are valid inputs in the module calculate the weighted score
            if (validInputsCount > 0) {
                blockScore += moduleScore * moduleWeight;
                blockWeights += moduleWeight;
            }
        });

        // If any of the modules are filled in calculate the block QCA and percentage
        if (blockWeights > 0) {
            const blockPercentage = blockScore / blockWeights;
            const blockQCA = calculateQCA(blockPercentage);

            const blockQCAElement = document.getElementById(`qca-value-${blockId}`);
            const blockPercentageElement = document.getElementById(`percentage-value-${blockId}`);

            // If the block id has a QCA and percentage area update the values
            if (blockQCAElement) { blockQCAElement.textContent = blockQCA.toFixed(2); }
            if (blockPercentageElement) { blockPercentageElement.textContent = `${Math.round(blockPercentage)}%`; }

            // Add the block score to the total score and the block weights to the total weights
            totalWeightedScore += blockScore;
            totalWeights += blockWeights;
        }
    });

    // Nab the final percentage and QCA
    const finalPercentage = totalWeights > 0 ? totalWeightedScore / totalWeights : 0;
    const qca = calculateQCA(finalPercentage);

    // Display the percentage and QCA
    document.getElementById('percentage-value').textContent = `${Math.round(finalPercentage)}%`;
    document.getElementById('qca-value').textContent = qca.toFixed(2);
}

// Do I need to comment what these do?
function createResultsArea() {
    // Creates the area 
    const resultsArea = document.createElement('div');
    resultsArea.className = 'results-area';

    // Does the html shenanigans which creates the results area
    resultsArea.innerHTML = `
        <h2 class="results-title">Overall Results</h2>
        <div class="results-grid">
            <div class="result-box">
                <div class="result-label">QCA</div>
                <div class="result-value" id="qca-value">0.00</div>
            </div>
            <div class="result-box">
                <div class="result-label">Overall Percentage</div>
                <div class="result-value" id="percentage-value">0%</div>
            </div>
        </div>
    `;

    // Hands that back to the caller
    return resultsArea;
}

function initializeForm() {
    const container = document.getElementById('form-sections');

    // The container should exist, if for some reason it doesn't don't try anything else
    if (!container) { return; }

    // Clear the container out
    container.innerHTML = '';

    // Names were made before multi-block support was added.
    Object.entries(formSections).forEach(([title, assessments]) => {
        const section = createSection(title, assessments);
        container.appendChild(section);
    });

    // Add the results area on after all the blocks get made
    container.appendChild(createResultsArea());
}

// When the DOM is loaded initialize the form
document.addEventListener('DOMContentLoaded', initializeForm);