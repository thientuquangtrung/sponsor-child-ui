import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MessageSquareMore, Paperclip, Smile, X } from 'lucide-react';

const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [emojiList, setEmojiList] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const API_KEY = 'ff91ca348f58cb783cad8cb159e9fb4dc04925ae';

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        console.log('File uploaded:', file);
    };

    const fetchEmojiList = async () => {
        try {
            const response = await fetch(`https://emoji-api.com/emojis?access_key=${API_KEY}`);
            const data = await response.json();
            setEmojiList(data);
        } catch (error) {
            console.error('Error fetching emoji:', error);
        }
    };

    useEffect(() => {
        fetchEmojiList();
    }, []);

    const handleSelectEmoji = (emoji) => {
        setMessage((prevMessage) => `${prevMessage} ${emoji.character}`);
        setShowEmojiPicker(false);
    };

    const handleSendMessage = (e) => {
        if (e.key === 'Enter' && message.trim()) {
            const newMessages = [...messages, { text: message, sender: 'you' }];
            setMessages(newMessages);
            setMessage('');

            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: 'This is a fake message from James', sender: 'james' },
                ]);
            }, 2000);
        }
    };

    return (
        <div className="fixed bottom-6 right-6">
            {!isOpen ? (
                <Button
                    onClick={toggleChat}
                    className="bg-teal-500 p-4 rounded-full w-16 h-16 flex items-center justify-center hover:bg-teal-600 shadow-custom animate-zoomWithShadow"
                >
                    <MessageSquareMore size={30} color="white" />
                </Button>
            ) : (
                <>
                    {/* Chatbox */}
                    <Card className="absolute bottom-20 right-0 w-96 shadow-xl bg-white z-50 rounded-lg">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200 bg-teal-500 text-white rounded-t-lg p-2">
                            <div className="flex items-center">
                                <img
                                    src="https://via.placeholder.com/400x300"
                                    alt="James"
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <h2 className="text-lg font-bold ml-2">James</h2>
                            </div>
                            <Button onClick={toggleChat} className="text-white bg-normal hover:bg-normal">
                                <X size={24} />
                            </Button>
                        </div>
                        <div className="mt-4 h-[350px] overflow-auto p-4">
                            {/* Hiển thị tin nhắn */}
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex mb-4 ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'james' && (
                                        <img
                                            src="https://via.placeholder.com/400x300"
                                            alt="James"
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                    )}
                                    <div
                                        className={`p-3 rounded-lg text-sm ${
                                            msg.sender === 'you' ? 'bg-teal-500 text-white' : 'bg-gray-100'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative mt-4 p-4">
                            <div className="relative flex items-center">
                                <Input
                                    type="text"
                                    className="w-full p-2 pr-16 border border-gray-300 rounded-md"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type here and press Enter to chat..."
                                    onKeyDown={handleSendMessage}
                                />

                                <Button
                                    className="absolute right-10 bg-transparent p-2 hover:bg-gray-100"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <Smile size={24} color="gray" />
                                </Button>

                                <Label
                                    htmlFor="file-upload"
                                    className="absolute right-2 cursor-pointer bg-transparent p-2 hover:bg-gray-100"
                                >
                                    <Paperclip size={24} color="gray" />
                                </Label>
                                <Input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
                            </div>

                            {showEmojiPicker && (
                                <div className="absolute right-10 bottom-16 mt-2 p-2 bg-white border shadow-xl rounded grid grid-cols-6 gap-2 max-h-60 overflow-y-auto">
                                    {emojiList.map((emoji) => (
                                        <span
                                            key={emoji.slug}
                                            className="cursor-pointer text-lg"
                                            onClick={() => handleSelectEmoji(emoji)}
                                        >
                                            {emoji.character}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>

                    <Button
                        onClick={toggleChat}
                        className="bg-teal-500 p-4 rounded-full shadow-lg w-16 h-16 flex items-center justify-center hover:bg-normal"
                    >
                        <X size={28} color="white" />
                    </Button>
                </>
            )}
        </div>
    );
};

export default Chat;
