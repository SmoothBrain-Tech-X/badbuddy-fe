
const transformApiMessages = (response: any): ChatMessage[] => {
    try {

        // Handle different possible response structures
        const messages = response?.data?.messages ||
            response?.data?.chat_massage ||
            response?.data ||
            [];

        // Validate that messages is an array
        if (!Array.isArray(messages)) {
            console.error('Messages is not an array:', messages);
            return [];
        }

        return messages.map(msg => {
            // Add validation for each message object
            if (!msg) {
                console.error('Invalid message object:', msg);
                return null;
            }

            try {
                return {
                    id: msg.id || String(Date.now() + Math.random()),
                    content: msg.message || '',
                    timestamp: msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    isOwn: msg.author?.id === CONFIG.CURRENT_USER_ID,
                    status: 'delivered' as MessageStatus,
                    type: 'text' as MessageType
                };
            } catch (err) {
                console.error('Error transforming message:', msg, err);
                return null;
            }
        }).filter((msg): msg is ChatMessage => msg !== null);
    } catch (err) {
        console.error('Error in transformApiMessages:', err);
        return [];
    }
};