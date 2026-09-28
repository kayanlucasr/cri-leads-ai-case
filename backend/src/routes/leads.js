import { Router } from 'express';
import { getLeads, getLeadById } from '../services/leadsService.js';
import { generateMessage } from '../services/messageService.js';

const router = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.post('/:id/message', async (req, res) => {
  if (!uuidPattern.test(req.params.id)) {
    return res.status(400).json({ error: 'ID de lead inválido.' });
  }

  let lead;
  try {
    lead = await getLeadById(req.params.id);
  } catch {
    return res.status(500).json({ error: 'Não foi possível consultar o lead. Tente novamente mais tarde.' });
  }

  if (!lead) {
    return res.status(404).json({ error: 'Lead não encontrado.' });
  }

  try {
    const message = await generateMessage({ name: lead.name, property_interest: lead.property_interest });
    return res.json({ message });
  } catch (error) {
    if (error.code === 'AI_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'Geração indisponível: configure OPENAI_API_KEY e OPENAI_MODEL no backend.' });
    }
    if (error.code === 'INVALID_LEAD_DATA') {
      return res.status(422).json({ error: 'Os dados deste lead não permitem gerar uma sugestão.' });
    }
    return res.status(502).json({ error: 'Não foi possível gerar a mensagem. Tente novamente mais tarde.' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const leads = await getLeads();
    res.json({ leads });
  } catch {
    res.status(500).json({
      error: 'Não foi possível consultar os leads. Tente novamente mais tarde.',
    });
  }
});

export default router;
