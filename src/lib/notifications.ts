
export async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered with scope:', registration.scope);
            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
    return null;
}

export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert("This browser does not support desktop notifications");
        return false;
    }

    let permission = Notification.permission;

    if (permission === 'default') {
        permission = await Notification.requestPermission();
    }

    return permission === 'granted';
}

export async function sendTestNotification() {
    const registration = await navigator.serviceWorker.ready;
    
    // In a real app, this would be sent from the server.
    // For local testing without a backend push server, we can use showNotification directly
    // to simulate what the SW would do.
    
    registration.showNotification('ParentingCertainty', {
        body: 'This is how your daily reminders will look!',
        icon: '/logo.svg'
    });
}
