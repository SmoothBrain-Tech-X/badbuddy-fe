import React from 'react';
import { Box, Group, TextInput, ActionIcon, Button } from '@mantine/core';
import { IconPaperclip, IconMoodSmile, IconSend } from '@tabler/icons-react';


const ChatInput: React.FC<{
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled: boolean;
}> = ({ value, onChange, onSend, disabled }) => (
    <Box
        p="xs"
        style={{
            borderTop: '1px solid var(--mantine-color-gray-3)',
            backgroundColor: '#f8f9fa',
            width: '100%'
        }}
    >
        <Group gap="xs" align="flex-end" style={{ width: '100%' }}>
            <ActionIcon
                variant="subtle"
                radius="xl"
                size="lg"
                color="gray"
                style={{ flexShrink: 0 }}
            >
                <IconPaperclip size={20} />
            </ActionIcon>

            <Box style={{ flex: 1, minWidth: 0 }}>
                <TextInput
                    placeholder="Type a message..."
                    value={value}
                    onChange={(e) => onChange(e.currentTarget.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onSend();
                        }
                    }}
                    styles={{
                        root: {
                            width: '100%'
                        },
                        wrapper: {
                            width: '100%'
                        },
                        input: {
                            borderRadius: '20px',
                            backgroundColor: 'white',
                            minHeight: '40px',
                            paddingRight: '40px',
                            fontSize: '14px',
                            width: '100%'
                        }
                    }}
                    rightSection={
                        <ActionIcon
                            variant="subtle"
                            radius="xl"
                            onClick={() => {/* Handle emoji picker */ }}
                            style={{ position: 'absolute', right: 8 }}
                        >
                            <IconMoodSmile size={18} />
                        </ActionIcon>
                    }
                />
            </Box>

            <Button
                disabled={!value.trim() || disabled}
                radius="xl"
                size="sm"
                style={{
                    backgroundColor: value.trim() && !disabled ? '#06c755' : 'var(--mantine-color-gray-4)',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    padding: 0,
                    minWidth: '40px',
                    flexShrink: 0
                }}
                onClick={onSend}
            >
                <IconSend size={18} />
            </Button>
        </Group>
    </Box>
);

export default ChatInput;