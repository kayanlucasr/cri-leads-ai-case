import { supabase } from '../lib/supabase.js';

export async function getLeadById(id) {
  try {
    const { data, error } = await supabase
      .schema('public')
      .from('leads')
      .select('id, name, property_interest')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch {
    throw new Error('Não foi possível consultar o lead.');
  }
}

export async function getLeads() {
  try {
    const { data, error } = await supabase
      .schema('public')
      .from('leads')
      .select('id, name, phone, property_interest, source, status, created_at')
      .order('created_at', { ascending: false })
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  } catch {
    // Descarta detalhes do provedor, inclusive em falhas de rede.
    throw new Error('Não foi possível consultar os leads.');
  }
}
