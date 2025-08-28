// Email Service for sending verification codes
class EmailService {
    constructor() {
        this.isConfigured = false;
        this.initEmailJS();
    }

    // Initialize EmailJS
    initEmailJS() {
        // Check if EmailJS is available
        if (typeof EmailJS !== 'undefined') {
            this.isConfigured = true;
            console.log('EmailJS is configured');
        } else {
            console.warn('EmailJS not found. Please include EmailJS in your HTML');
        }
    }

    // Send verification code via EmailJS
    async sendVerificationCode(email, code) {
        if (!this.isConfigured) {
            throw new Error('EmailJS is not configured');
        }

        try {
            const templateParams = {
                to_email: email,
                verification_code: code,
                message: `رمز التحقق الخاص بك هو: ${code}`
            };

            const response = await EmailJS.send(
                'service_id', // Replace with your EmailJS service ID
                'template_id', // Replace with your EmailJS template ID
                templateParams,
                'user_id' // Replace with your EmailJS user ID
            );

            console.log('Email sent successfully:', response);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    // Send verification code via SMTP (using a backend service)
    async sendVerificationCodeSMTP(email, code) {
        try {
            const response = await fetch('/api/send-verification-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    code: code
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Error sending email via SMTP:', error);
            throw error;
        }
    }

    // Send verification code via a free email service (like EmailJS)
    async sendVerificationCodeFree(email, code) {
        // This is a mock implementation for demonstration
        // In a real application, you would use EmailJS, SendGrid, or similar
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate email sending
                console.log(`Sending verification code ${code} to ${email}`);
                
                // For demo purposes, we'll simulate success
                // In reality, this would call a real email service
                resolve(true);
            }, 2000);
        });
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}
