"use strict";
/* Copyright © 2022 Seneca Project Contributors, MIT License. */
Object.defineProperty(exports, "__esModule", { value: true });
/* NOTES
 * oref, aref, bref are mostly for human repl convenience
 *
 * Unique constraints:
 * ledger/account: aref
 */
function ledger(options) {
    const seneca = this;
    const accountCanon = options.entity.base + '/account';
    const bookCanon = options.entity.base + '/book';
    const entryCanon = options.entity.base + '/entry';
    const balanceCanon = options.entity.base + '/balance';
    seneca
        .fix('biz:ledger')
        .message('create:account', msgCreateAccount)
        .message('get:account', msgGetAccount)
        .message('list:account', msgListAccount)
        .message('update:account', msgUpdateAccount)
        .message('list:account', msgListAccount)
        .message('balance:account', msgBalanceAccount)
        .message('create:book', msgCreateBook)
        .message('get:book', msgGetBook)
        .message('update:book', msgUpdateBook)
        .message('list:book', msgListBook)
        .message('list:balance', msgListBalance)
        .message('balance:book', msgBalanceBook)
        .message('create:entry', msgCreateEntry)
        .message('void:entry', msgVoidEntry)
        .message('list:entry', msgListEntry);
    async function msgCreateAccount(msg) {
        let seneca = this;
        let oref = null == msg.oref ? msg.org_id : msg.oref;
        let org_id = null == msg.org_id ? msg.oref : msg.org_id;
        if (null == org_id) {
            return { ok: false, why: 'no-org' };
        }
        let name = msg.name;
        if (null == name || '' == name) {
            return { ok: false, why: 'no-name' };
        }
        let path = ('string' === typeof msg.path ? msg.path.split('/') : msg.path) || [];
        let pathParts = Array(options.path.partSize).fill(null)
            .reduce(((a, _, i) => (a['path' + i] = null == path[i] ? '' : path[i], a)), {});
        let aref = msg.oref + '/' + path.join('/') + '/' + name;
        let normal = msg.normal;
        if ('c' !== normal && 'd' !== normal) {
            return { ok: false, why: 'invalid-normal' };
        }
        let accountEnt = await seneca.entity(accountCanon).data$({
            id$: msg.id,
            ...pathParts,
            org_id,
            oref,
            aref,
            path,
            name,
            normal,
        }).save$();
        return { ok: true, account: accountEnt.data$() };
    }
    async function msgGetAccount(msg) {
        let seneca = this;
        let accountEnt = null;
        if (null != msg.aref) {
            accountEnt = await seneca.entity(accountCanon).load$({ aref: msg.aref });
        }
        if (null == accountEnt && null != msg.id) {
            accountEnt = await seneca.entity(accountCanon).load$(msg.id);
        }
        if (null == accountEnt && null != msg.account_id) {
            accountEnt = await seneca.entity(accountCanon).load$(msg.account_id);
        }
        if (null == accountEnt) {
            return { ok: false, why: 'account-not-found' };
        }
        return { ok: true, accountEnt };
    }
    async function msgListAccount(msg) {
        let seneca = this;
        let org_id = null == msg.org_id ? msg.oref : msg.org_id;
        let q = {};
        if (null != org_id) {
            q.org_id = org_id;
        }
        let list = await seneca.entity(accountCanon).list$(q);
        return { ok: true, q, list };
    }
    async function msgUpdateAccount(msg) { }
    async function msgBalanceAccount(msg) { }
    async function msgCreateBook(msg) {
        let seneca = this;
        let start = msg.start;
        if (null == start) {
            return { ok: false, why: 'no-start' };
        }
        let oref = null == msg.oref ? msg.org_id : msg.oref;
        let org_id = null == msg.org_id ? msg.oref : msg.org_id;
        if (null == org_id) {
            return { ok: false, why: 'no-org' };
        }
        let end = msg.end || -1;
        let time = msg.time || { kind: 'basic' };
        let name = msg.name;
        if (null == name || '' == name) {
            return { ok: false, why: 'no-name' };
        }
        let bref = oref + '/' + name + '/' + start;
        let bookEnt = await seneca.entity(bookCanon).data$({
            id$: msg.id,
            org_id,
            oref,
            bref,
            name,
            start,
            end,
            time,
        }).save$();
        return { ok: true, book: bookEnt.data$() };
    }
    async function msgGetBook(msg) {
        let seneca = this;
        let bookEnt = null;
        if (null != msg.bref) {
            bookEnt = await seneca.entity(bookCanon).load$({ bref: msg.bref });
        }
        if (null == bookEnt && null != msg.id) {
            bookEnt = await seneca.entity(bookCanon).load$(msg.id);
        }
        if (null == bookEnt && null != msg.book_id) {
            bookEnt = await seneca.entity(bookCanon).load$(msg.book_id);
        }
        if (null == bookEnt) {
            return { ok: false, why: 'book-not-found' };
        }
        return { ok: true, bookEnt };
    }
    async function msgListBook(msg) {
        let seneca = this;
        let org_id = null == msg.org_id ? msg.oref : msg.org_id;
        let q = {};
        if (null != org_id) {
            q.org_id = org_id;
        }
        let list = await seneca.entity(bookCanon).list$(q);
        return { ok: true, q, list };
    }
    async function msgUpdateBook(msg) { }
    async function msgListBalance(msg) { }
    async function msgBalanceBook(msg) { }
    async function msgCreateEntry(msg) { }
    async function msgVoidEntry(msg) { }
    async function msgListEntry(msg) { }
}
// Default options.
const defaults = {
    debug: false,
    path: {
        partSize: 3,
    },
    entity: {
        base: 'ledger'
    }
};
Object.assign(ledger, {
    defaults
});
exports.default = ledger;
if ('undefined' !== typeof module) {
    module.exports = ledger;
}
//# sourceMappingURL=ledger.js.map