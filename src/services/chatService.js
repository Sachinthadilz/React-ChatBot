import { supabase } from '../lib/supabaseClient';

/**
 * Save a new chat to the database
 */
export async function saveChat(userId, chat) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .insert({
            user_id: userId,
            title: chat.title || 'New Chat',
        })
        .select()
        .single();

    if (chatError) throw chatError;

    // Save messages
    if (chat.messages && chat.messages.length > 0) {
        const messagesData = chat.messages.map((msg) => ({
            chat_id: chatData.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp || new Date().toISOString(),
        }));

        const { error: messagesError } = await supabase
            .from('messages')
            .insert(messagesData);

        if (messagesError) throw messagesError;
    }

    return { ...chatData, messages: chat.messages || [] };
}

/**
 * Load all chats for a user
 */
export async function loadUserChats(userId) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: chats, error: chatsError } = await supabase
        .from('chats')
        .select(`
      id,
      title,
      created_at,
      updated_at,
      messages (
        id,
        role,
        content,
        timestamp,
        created_at
      )
    `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

    if (chatsError) throw chatsError;

    return chats.map((chat) => ({
        id: chat.id,
        title: chat.title,
        messages: chat.messages.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
        ),
    }));
}

/**
 * Update chat messages
 */
export async function updateChat(chatId, messages) {
    if (!supabase) throw new Error('Supabase not configured');

    // Update chat's updated_at timestamp
    const { error: updateError } = await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

    if (updateError) throw updateError;

    // Delete existing messages
    const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('chat_id', chatId);

    if (deleteError) throw deleteError;

    // Insert new messages
    if (messages && messages.length > 0) {
        const messagesData = messages.map((msg) => ({
            chat_id: chatId,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp || new Date().toISOString(),
        }));

        const { error: insertError } = await supabase
            .from('messages')
            .insert(messagesData);

        if (insertError) throw insertError;
    }
}

/**
 * Delete a chat and its messages
 */
export async function deleteChat(chatId) {
    if (!supabase) throw new Error('Supabase not configured');

    // Messages will be deleted automatically due to CASCADE
    const { error } = await supabase.from('chats').delete().eq('id', chatId);

    if (error) throw error;
}

/**
 * Update chat title
 */
export async function updateChatTitle(chatId, title) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
        .from('chats')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', chatId);

    if (error) throw error;
}
