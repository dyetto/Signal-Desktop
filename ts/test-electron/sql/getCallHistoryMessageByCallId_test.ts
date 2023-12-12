// Copyright 2023 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { assert } from 'chai';
import { v4 as generateUuid } from 'uuid';

import dataInterface from '../../sql/Client';
import { generateAci } from '../../types/ServiceId';

import type { MessageAttributesType } from '../../model-types.d';

const {
  removeAll,
  _getAllMessages,
  saveMessages,
  getCallHistoryMessageByCallId,
} = dataInterface;

describe('sql/getCallHistoryMessageByCallId', () => {
  beforeEach(async () => {
    await removeAll();
  });

  it('returns a previous call history message', async () => {
    assert.lengthOf(await _getAllMessages(), 0);

    const now = Date.now();
    const conversationId = generateUuid();
    const ourAci = generateAci();

    const callHistoryMessage: MessageAttributesType = {
      id: generateUuid(),
      type: 'call-history',
      conversationId,
      sent_at: now - 10,
      received_at: now - 10,
      timestamp: now - 10,
      callId: '12345',
    };

    await saveMessages([callHistoryMessage], {
      forceSave: true,
      ourAci,
    });

    const allMessages = await _getAllMessages();
    assert.lengthOf(allMessages, 1);

    const message = await getCallHistoryMessageByCallId({
      conversationId,
      callId: '12345',
    });
    assert.strictEqual(message?.id, callHistoryMessage.id);
  });
});
