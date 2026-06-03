import nodemailer from 'nodemailer';

const sendOrderNotification = async (orderData, userDetails = {}) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL, 
            subject: `New Order Received! Order ID: ${orderData._id}`,
            html: `
                <h2>You have a new order!</h2>
                <p><strong>Order ID:</strong> ${orderData._id}</p>
                <p><strong>Customer Email:</strong> ${userDetails.email || 'N/A'}</p>
                <p><strong>Payment Method:</strong> ${orderData.paymentMethod.toUpperCase()}</p>
                <p><strong>Total Amount (incl. shipping):</strong> ₦${orderData.totalAmount.toLocaleString()}</p>
                
                <h3>Items Ordered:</h3>
                <ul>
                  ${orderData.items.map(item => 
                    `<li>Product ID: ${item.product} (Qty: ${item.quantity}) - Variant: [${item.size} / ${item.color}] - ₦${(item.price * item.quantity).toLocaleString()}</li>`
                  ).join('')}
                </ul>
                <br />
                <p>Check your admin dashboard to process this order.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Order notification email sent successfully!');
    } catch (error) {
        console.error('Error sending order notification email:', error);
    }
};

export default sendOrderNotification;