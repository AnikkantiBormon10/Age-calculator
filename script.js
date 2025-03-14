document.addEventListener('DOMContentLoaded', function() {
    const birthDateInput = document.getElementById('birth-date');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultSection = document.getElementById('result-section');
    const errorMessage = document.getElementById('error-message');
    
    // Elements for displaying age values
    const yearsElement = document.getElementById('years');
    const monthsElement = document.getElementById('months');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // Set max date to today
    const today = new Date();
    const formattedDate = formatDate(today);
    birthDateInput.setAttribute('max', formattedDate);
    
    // Format date to YYYY-MM-DD for input max attribute
    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Calculate age function
    function calculateAge() {
        // Clear previous results
        resetDisplay();
        
        const birthDate = new Date(birthDateInput.value);
        const now = new Date();
        
        // Validate the date
        if (!birthDateInput.value) {
            showError("Please enter your date of birth");
            return;
        }
        
        if (birthDate > now) {
            showError("Birthday cannot be in the future");
            return;
        }
        
        if (isNaN(birthDate.getTime())) {
            showError("Please enter a valid date");
            return;
        }
        
        // Calculate difference in milliseconds
        const diffMs = now - birthDate;
        
        // Convert to appropriate units
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        // Calculate years, months and remaining days
        let years = 0;
        let months = 0;
        let remainingDays = days;
        
        // Create a new Date object for incremental calculation
        let tempDate = new Date(birthDate);
        
        // Calculate years
        while (true) {
            tempDate.setFullYear(tempDate.getFullYear() + 1);
            if (tempDate > now) {
                tempDate.setFullYear(tempDate.getFullYear() - 1);
                break;
            }
            years++;
        }
        
        // Calculate months
        while (true) {
            tempDate.setMonth(tempDate.getMonth() + 1);
            if (tempDate > now) {
                tempDate.setMonth(tempDate.getMonth() - 1);
                break;
            }
            months++;
        }
        
        // Calculate remaining days
        const lastMonthDate = new Date(tempDate);
        remainingDays = Math.floor((now - lastMonthDate) / (1000 * 60 * 60 * 24));
        
        // Calculate remaining hours, minutes, seconds
        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;
        
        // Update the display
        updateDisplay(years, months, remainingDays, remainingHours, remainingMinutes, remainingSeconds);
        
        // Show result section with animation
        resultSection.classList.add('active');
        
        // Start updating seconds in real-time
        startRealTimeUpdate(birthDate);
    }
    
    // Variables to store interval ID
    let realTimeInterval;
    
    // Start real-time update for seconds, minutes, etc.
    function startRealTimeUpdate(birthDate) {
        // Clear any existing interval
        if (realTimeInterval) {
            clearInterval(realTimeInterval);
        }
        
        // Update every second
        realTimeInterval = setInterval(() => {
            const now = new Date();
            const diffMs = now - birthDate;
            
            // Convert to appropriate units
            const seconds = Math.floor(diffMs / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            
            // Calculate remaining values
            const remainingHours = hours % 24;
            const remainingMinutes = minutes % 60;
            const remainingSeconds = seconds % 60;
            
            // Update only the dynamic values
            hoursElement.textContent = remainingHours;
            minutesElement.textContent = remainingMinutes;
            secondsElement.textContent = remainingSeconds;
        }, 1000);
    }
    
    // Update display with calculated values
    function updateDisplay(years, months, days, hours, minutes, seconds) {
        yearsElement.textContent = years;
        monthsElement.textContent = months;
        daysElement.textContent = days;
        hoursElement.textContent = hours;
        minutesElement.textContent = minutes;
        secondsElement.textContent = seconds;
        
        // Add animation class to each element
        animateNumbers();
    }
    
    // Animate the numbers
    function animateNumbers() {
        const numberElements = document.querySelectorAll('.time-box span');
        numberElements.forEach((element, index) => {
            // Add and remove class to trigger animation
            setTimeout(() => {
                element.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
    }
    
    // Reset display
    function resetDisplay() {
        yearsElement.textContent = '-';
        monthsElement.textContent = '-';
        daysElement.textContent = '-';
        hoursElement.textContent = '-';
        minutesElement.textContent = '-';
        secondsElement.textContent = '-';
        
        // Clear error message
        errorMessage.style.opacity = '0';
    }
    
    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.opacity = '1';
        
        // Hide result section
        resultSection.classList.remove('active');
        
        // Clear any running interval
        if (realTimeInterval) {
            clearInterval(realTimeInterval);
        }
    }
    
    // Event listeners
    calculateBtn.addEventListener('click', calculateAge);
    
    // Also calculate on Enter key press
    birthDateInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateAge();
        }
    });
});