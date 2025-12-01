
        document.addEventListener('DOMContentLoaded', function() {
            // Form navigation variables
            const form = document.getElementById('projectForm');
            const steps = document.querySelectorAll('.form-step');
            const progressSteps = document.querySelectorAll('.progress-step');
            const nextBtns = document.querySelectorAll('.next-btn');
            const prevBtns = document.querySelectorAll('.prev-btn');
            const submitBtn = document.getElementById('submitFormBtn');
            const successMessage = document.getElementById('successMessage');
            const clientNameSpan = document.getElementById('clientName');
            const loadingSpinner = document.getElementById('loadingSpinner');
            const loadingText = document.getElementById('loadingText');
            const submissionStatus = document.getElementById('submissionStatus');
            const statusText = document.getElementById('statusText');
            
            // Country search variables
            const countrySelect = document.getElementById('country');
            const countrySearch = document.getElementById('countrySearch');
            const countryResults = document.getElementById('countryResults');
            
            // Submission settings
            const SUBMISSION_TIMEOUT = 30000;
            
            let currentStep = 0;
            let isSubmitting = false;
            let submissionTimeout = null;
            let countries = [];
            
            // Initialize form
            updateProgressBar();
            initializeCountrySearch();
            
            // Initialize country search functionality
            function initializeCountrySearch() {
                if (!countrySelect || !countrySearch || !countryResults) return;
                
                // Extract countries from select options
                countries = Array.from(countrySelect.options).map(option => ({
                    value: option.value,
                    text: option.textContent,
                    element: option
                }));
                
                // Show initial selected value
                const selectedOption = countrySelect.options[countrySelect.selectedIndex];
                if (selectedOption && selectedOption.value) {
                    countrySearch.value = selectedOption.textContent;
                }
                
                // Search functionality
                countrySearch.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase().trim();
                    countryResults.innerHTML = '';
                    
                    if (searchTerm.length === 0) {
                        countryResults.style.display = 'none';
                        return;
                    }
                    
                    // Filter countries
                    const filtered = countries.filter(country => 
                        country.value && country.text.toLowerCase().includes(searchTerm)
                    );
                    
                    if (filtered.length === 0) {
                        // Show custom option
                        const customDiv = document.createElement('div');
                        customDiv.className = 'country-search-result';
                        customDiv.innerHTML = `
                            <i class="fas fa-plus-circle" style="margin-right: 8px;"></i>
                            <span>Use custom: "${searchTerm}"</span>
                        `;
                        customDiv.addEventListener('click', function() {
                            // Set custom country
                            countrySelect.value = '';
                            countrySelect.setAttribute('data-custom-country', searchTerm);
                            countrySearch.value = searchTerm;
                            countryResults.style.display = 'none';
                        });
                        countryResults.appendChild(customDiv);
                    } else {
                        // Show filtered results
                        filtered.forEach(country => {
                            const div = document.createElement('div');
                            div.className = 'country-search-result';
                            div.textContent = country.text;
                            div.addEventListener('click', function() {
                                countrySelect.value = country.value;
                                countrySearch.value = country.text;
                                countryResults.style.display = 'none';
                                // Remove custom data if exists
                                countrySelect.removeAttribute('data-custom-country');
                            });
                            countryResults.appendChild(div);
                        });
                    }
                    
                    countryResults.style.display = 'block';
                });
                
                // Close results when clicking outside
                document.addEventListener('click', function(event) {
                    if (!event.target.closest('.country-search-wrapper')) {
                        countryResults.style.display = 'none';
                    }
                });
                
                // Handle Enter key
                countrySearch.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const searchTerm = this.value.trim();
                        if (searchTerm) {
                            // Check if it matches any country
                            const exactMatch = countries.find(country => 
                                country.text.toLowerCase() === searchTerm.toLowerCase()
                            );
                            
                            if (exactMatch) {
                                countrySelect.value = exactMatch.value;
                                countrySelect.removeAttribute('data-custom-country');
                            } else {
                                // Set as custom country
                                countrySelect.value = '';
                                countrySelect.setAttribute('data-custom-country', searchTerm);
                            }
                        }
                        countryResults.style.display = 'none';
                    }
                });
            }
            
            // Toast notification function
            function showToast(message, type = 'success') {
                const toastContainer = document.getElementById('toastContainer');
                
                // Clear old toasts
                const oldToasts = toastContainer.querySelectorAll('.toast');
                if (oldToasts.length > 2) {
                    oldToasts[0].remove();
                }
                
                const toast = document.createElement('div');
                toast.className = `toast toast-${type}`;
                
                let icon = 'check-circle';
                if (type === 'error') icon = 'exclamation-circle';
                if (type === 'warning') icon = 'exclamation-triangle';
                if (type === 'info') icon = 'info-circle';
                
                toast.innerHTML = `
                    <i class="fas fa-${icon}"></i>
                    <span>${message}</span>
                `;
                
                toastContainer.appendChild(toast);
                
                // Show toast
                setTimeout(() => toast.classList.add('show'), 10);
                
                // Remove toast after 4 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => {
                        if (toast.parentNode) {
                            toast.remove();
                        }
                    }, 300);
                }, 4000);
            }
            
            // Navigate to specific step
            function goToStep(step) {
                if (step >= 0 && step < steps.length) {
                    steps[currentStep].classList.remove('active');
                    progressSteps[currentStep].classList.remove('active');
                    
                    currentStep = step;
                    
                    steps[currentStep].classList.add('active');
                    progressSteps[currentStep].classList.add('active');
                    updateProgressBar();
                }
            }
            
            // Next button event listeners
            nextBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (validateStep(currentStep)) {
                        // Move to next step
                        steps[currentStep].classList.remove('active');
                        progressSteps[currentStep].classList.remove('active');
                        
                        currentStep++;
                        
                        steps[currentStep].classList.add('active');
                        progressSteps[currentStep].classList.add('active');
                        updateProgressBar();
                    }
                });
            });
            
            // Previous button event listeners
            prevBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Move to previous step
                    steps[currentStep].classList.remove('active');
                    progressSteps[currentStep].classList.remove('active');
                    
                    currentStep--;
                    
                    steps[currentStep].classList.add('active');
                    progressSteps[currentStep].classList.add('active');
                    updateProgressBar();
                });
            });
            
            // Update progress bar
            function updateProgressBar() {
                progressSteps.forEach((step, index) => {
                    if (index < currentStep) {
                        step.classList.add('completed');
                        step.classList.remove('active');
                    } else if (index === currentStep) {
                        step.classList.add('active');
                        step.classList.remove('completed');
                    } else {
                        step.classList.remove('active', 'completed');
                    }
                });
            }
            
            // Validate current step
            function validateStep(step) {
                const currentStepElement = steps[step];
                const requiredFields = currentStepElement.querySelectorAll('[required]');
                let isValid = true;
                
                // Clear previous error messages and styles
                currentStepElement.querySelectorAll('.error-message').forEach(msg => {
                    msg.textContent = '';
                });
                currentStepElement.querySelectorAll('.input-error').forEach(field => {
                    field.classList.remove('input-error');
                });
                
                // Validate required fields
                for (let field of requiredFields) {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('input-error');
                        
                        const errorId = `${field.id || field.name}Error`;
                        let errorElement = document.getElementById(errorId);
                        
                        if (!errorElement) {
                            errorElement = document.createElement('div');
                            errorElement.className = 'error-message';
                            errorElement.id = errorId;
                            field.parentNode.appendChild(errorElement);
                        }
                        
                        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> This field is required`;
                    }
                    
                    // Email validation
                    if (field.type === 'email' && field.value.trim()) {
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(field.value)) {
                            isValid = false;
                            field.classList.add('input-error');
                            
                            const errorId = `${field.id || field.name}Error`;
                            let errorElement = document.getElementById(errorId);
                            
                            if (!errorElement) {
                                errorElement = document.createElement('div');
                                errorElement.className = 'error-message';
                                errorElement.id = errorId;
                                field.parentNode.appendChild(errorElement);
                            }
                            
                            errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> Please enter a valid email address`;
                        }
                    }
                }
                
                // Special validation for step 2 (project type)
                if (step === 2) {
                    const projectTypeCheckboxes = currentStepElement.querySelectorAll('input[name="projectType"]:checked');
                    if (projectTypeCheckboxes.length === 0) {
                        isValid = false;
                        document.getElementById('projectTypeError').innerHTML = `<i class="fas fa-exclamation-circle"></i> Please select at least one project type`;
                    } else {
                        document.getElementById('projectTypeError').textContent = '';
                    }
                }
                
                // Special validation for step 3 (purpose)
                if (step === 3) {
                    const purposeRadio = currentStepElement.querySelector('input[name="purpose"]:checked');
                    if (!purposeRadio) {
                        isValid = false;
                        document.getElementById('purposeError').innerHTML = `<i class="fas fa-exclamation-circle"></i> Please select the main purpose of your website`;
                    } else {
                        document.getElementById('purposeError').textContent = '';
                    }
                }
                
                // Special validation for step 5 (features)
                if (step === 5) {
                    const featureCheckboxes = currentStepElement.querySelectorAll('input[name="features"]:checked');
                    if (featureCheckboxes.length === 0) {
                        isValid = false;
                        document.getElementById('featuresError').innerHTML = `<i class="fas fa-exclamation-circle"></i> Please select at least one feature`;
                    } else {
                        document.getElementById('featuresError').textContent = '';
                    }
                }
                
                // Special validation for step 7 (content)
                if (step === 7) {
                    const contentRadio = currentStepElement.querySelector('input[name="content"]:checked');
                    if (!contentRadio) {
                        isValid = false;
                        document.getElementById('contentError').innerHTML = `<i class="fas fa-exclamation-circle"></i> Please select an option for content availability`;
                    } else {
                        document.getElementById('contentError').textContent = '';
                    }
                }
                
                // Special validation for step 8 (timeline)
                if (step === 8) {
                    const timelineRadio = currentStepElement.querySelector('input[name="timeline"]:checked');
                    if (!timelineRadio) {
                        isValid = false;
                        document.getElementById('timelineError').innerHTML = `<i class="fas fa-exclamation-circle"></i> Please select a preferred timeline`;
                    } else {
                        document.getElementById('timelineError').textContent = '';
                    }
                }
                
                if (!isValid) {
                    showToast('Please fix the errors before continuing', 'error');
                }
                
                return isValid;
            }
            
            // Show/hide "Other" text input for project type
            const projectTypeOther = document.querySelector('input[name="projectType"][value="Other"]');
            const otherTypeContainer = document.getElementById('otherTypeContainer');
            
            if (projectTypeOther) {
                projectTypeOther.addEventListener('change', function() {
                    otherTypeContainer.style.display = this.checked ? 'block' : 'none';
                });
            }
            
            // Show/hide "Other" text input for purpose
            const purposeOther = document.querySelector('input[name="purpose"][value="Other"]');
            const otherPurposeContainer = document.getElementById('otherPurposeContainer');
            
            if (purposeOther) {
                purposeOther.addEventListener('change', function() {
                    otherPurposeContainer.style.display = this.checked ? 'block' : 'none';
                });
            }
            
            // Show/hide "Other" text input for audience
            const audienceOther = document.querySelector('input[name="audience"][value="Other"]');
            const otherAudienceContainer = document.getElementById('otherAudienceContainer');
            
            if (audienceOther) {
                audienceOther.addEventListener('change', function() {
                    otherAudienceContainer.style.display = this.checked ? 'block' : 'none';
                });
            }
            
            // Show/hide "Other" text input for features
            const featuresOther = document.querySelector('input[name="features"][value="Other"]');
            const otherFeaturesContainer = document.getElementById('otherFeaturesContainer');
            
            if (featuresOther) {
                featuresOther.addEventListener('change', function() {
                    otherFeaturesContainer.style.display = this.checked ? 'block' : 'none';
                });
            }
            
            // Show/hide datetime picker for consultation call
            const consultationYes = document.querySelector('input[name="consultation"][value="Yes"]');
            const callDateTimeContainer = document.getElementById('callDateTimeContainer');
            
            if (consultationYes) {
                consultationYes.addEventListener('change', function() {
                    callDateTimeContainer.style.display = this.checked ? 'block' : 'none';
                });
            }
            
            // Color picker functionality
            const colorOptions = document.querySelectorAll('.color-option');
            const brandColorsInput = document.getElementById('brandColors');
            
            let selectedColors = [];
            
            colorOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const color = this.getAttribute('data-color');
                    
                    if (this.classList.contains('selected')) {
                        // Remove color
                        this.classList.remove('selected');
                        selectedColors = selectedColors.filter(c => c !== color);
                    } else {
                        // Add color
                        this.classList.add('selected');
                        selectedColors.push(color);
                    }
                    
                    // Update hidden input
                    brandColorsInput.value = selectedColors.join(', ');
                });
            });
            
            // Form submission
            submitBtn.addEventListener('click', function() {
                if (validateStep(currentStep)) {
                    submitForm();
                }
            });
            
            async function submitForm() {
                if (isSubmitting) {
                    showToast('Form is already submitting, please wait...', 'warning');
                    return;
                }
                
                isSubmitting = true;
                const fullName = document.getElementById('fullName').value;
                clientNameSpan.textContent = fullName;
                
                // Show immediate feedback
                submitBtn.disabled = true;
                submissionStatus.classList.remove('hidden');
                statusText.textContent = 'Preparing submission...';
                
                // Show loading spinner after 1 second (if still submitting)
                const spinnerTimeout = setTimeout(() => {
                    loadingText.textContent = 'Sending to Formspree...';
                    loadingSpinner.classList.add('active');
                }, 1000);
                
                // Set submission timeout
                submissionTimeout = setTimeout(() => {
                    if (isSubmitting) {
                        handleSubmissionError('Submission is taking too long. Please check your connection and try again.');
                    }
                }, SUBMISSION_TIMEOUT);
                
                try {
                    // Step 1: Prepare form data
                    statusText.textContent = 'Preparing data...';
                    
                    const formData = new FormData();
                    
                    // Collect text fields
                    const textFields = ['fullName', 'email', 'company', 'otherType', 
                                      'otherPurpose', 'otherAudience', 'otherFeatures', 
                                      'websiteReferences', 'customColors', 'brandColors',
                                      'additionalInfo', 'callDateTime'];
                    
                    textFields.forEach(fieldId => {
                        const field = document.getElementById(fieldId);
                        if (field && field.value) {
                            formData.append(fieldId, field.value);
                        }
                    });
                    
                    // Handle country field
                    let countryValue = countrySelect.value;
                    if (!countryValue && countrySelect.getAttribute('data-custom-country')) {
                        countryValue = countrySelect.getAttribute('data-custom-country');
                    }
                    if (countryValue) {
                        formData.append('country', countryValue);
                    }
                    
                    // Add checkbox groups as summaries
                    statusText.textContent = 'Processing selections...';
                    
                    const checkboxGroups = {
                        'Project Type': 'projectType',
                        'Target Audience': 'audience',
                        'Features': 'features',
                        'Design Style': 'style'
                    };
                    
                    Object.entries(checkboxGroups).forEach(([label, name]) => {
                        const checked = Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
                            .map(cb => cb.value);
                        if (checked.length > 0) {
                            formData.append(label, checked.join(', '));
                        }
                    });
                    
                    // Add radio values
                    const radioFields = {
                        'Main Purpose': 'purpose',
                        'Has Logo': 'hasLogo',
                        'Content Availability': 'content',
                        'Timeline': 'timeline',
                        'Budget Range': 'budget',
                        'Consultation Call': 'consultation'
                    };
                    
                    Object.entries(radioFields).forEach(([label, name]) => {
                        const selected = document.querySelector(`input[name="${name}"]:checked`);
                        if (selected) {
                            formData.append(label, selected.value);
                        }
                    });
                    
                    // Step 2: Submit to Formspree
                    statusText.textContent = 'Submitting to server...';
                    loadingText.textContent = 'Submitting to Formspree...';
                    
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 25000);
                    
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        },
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    
                    // Step 3: Handle response
                    if (response.ok) {
                        statusText.textContent = 'Finalizing...';
                        
                        // Hide current step and show success
                        steps[currentStep].classList.remove('active');
                        successMessage.classList.remove('hidden');
                        successMessage.classList.add('active');
                        
                        // Update progress bar
                        progressSteps.forEach(step => {
                            step.classList.add('completed');
                            step.classList.remove('active');
                        });
                        
                        showToast('Form submitted successfully!', 'success');
                        
                    } else {
                        throw new Error(`Server responded with status: ${response.status}`);
                    }
                    
                } catch (error) {
                    handleSubmissionError(error.message || 'Submission failed');
                    
                } finally {
                    // Cleanup
                    clearTimeout(spinnerTimeout);
                    clearTimeout(submissionTimeout);
                    
                    loadingSpinner.classList.remove('active');
                    submissionStatus.classList.add('hidden');
                    submitBtn.disabled = false;
                    isSubmitting = false;
                }
            }
            
            function handleSubmissionError(errorMessage) {
                console.error('Submission error:', errorMessage);
                
                showToast(`Submission failed: ${errorMessage}`, 'error');
                
                // Re-enable button with retry option
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-redo"></i> Try Again';
                submitBtn.onclick = function() {
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Form';
                    submitForm();
                };
            }
            
            // Set minimum datetime for call scheduling
            const callDateTimeInput = document.getElementById('callDateTime');
            if (callDateTimeInput) {
                const now = new Date();
                callDateTimeInput.min = now.toISOString().slice(0, 16);
            }
        });