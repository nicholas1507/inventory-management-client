import React, { useState } from "react";
import {
    CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter, CButton
} from '@coreui/react';

const InboundModal = ({ visible, setVisible, onSubmit, suppliers, products }) => {
    const [items, setItems] = useState([
        { productId: "", quantity: 1 }
    ]);
    const [supplierId, setSupplierId] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = field === 'quantity' ? parseInt(value) || 0 : value;
        setItems(newItems);
    }
    const addRow = () => {
        setItems([...items, { productId: "", quantity: 1 }])
    }
    const removedRow = (index) => {
        const result = items.filter((_, i) => i !== index);
        setItems(result);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const payload = {
            items: items,
            supplierId: supplierId,
            notes: notes,
            type: "IN"
        }
        const emptyProduct = items.some(item => !item.productId);
        if(!supplierId || emptyProduct){
            alert("Please select supplier and all products!");
            return;
        }
        try {
            await onSubmit(payload);
            setSupplierId("");
            setNotes("");
            setItems([{productId: "", quantity: 1}]);
            setVisible(false);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to submit Inbound movement!");
        } finally {
            setLoading(false);
        }
    }
    return (
        <CModal visible={visible} onClose={() => setVisible(false)} size="lg" alignment="center" backdrop="static">
            <div style={{ backgroundColor: '#fff', color: '#1e293b', fontFamily: 'Inter, system-ui, sans-serif' }}>
                <form onSubmit={handleSubmit}>
                    <CModalHeader style={{ borderBottom: '1px solid #f1f5f9', padding: '20px 24px' }}>
                        <CModalTitle style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.025em' }}>
                            Inbound Stock Entry
                        </CModalTitle>
                    </CModalHeader>

                    <CModalBody style={{ padding: '24px' }}>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                            {/* Supplier */}
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                    Supplier Source
                                </label>
                                <select
                                    value={supplierId}
                                    onChange={(e) => setSupplierId(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }}
                                    required
                                >
                                    <option value="">Select a supplier...</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            {/* Notes */}
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                    Transaction Notes
                                </label>
                                <input
                                    type="text"
                                    placeholder="Inbound Notes"
                                    value={notes} // Tambahkan state [notes, setNotes]
                                    onChange={(e) => setNotes(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        </div>

                        {/*  ITEMS  */}
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                                Items List
                            </label>

                            <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '8px' }}>
                                {items.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ flex: 3 }}>
                                            <select
                                                value={item.productId}
                                                onChange={(e) => handleChange(index, 'productId', e.target.value)}
                                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: '#fff' }}
                                                required
                                            >
                                                <option value="">Select Product</option>
                                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="Qty"
                                                value={item.quantity}
                                                onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                                                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', textAlign: 'center' }}
                                                required
                                            />
                                        </div>

                                        <div style={{ width: '32px' }}>
                                            {items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removedRow(index)}
                                                    style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '18px' }}
                                                > ✕ </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="button" onClick={addRow} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '8px 0' }}>
                            + Add another product
                        </button>
                    </CModalBody>

                    <CModalFooter style={{ borderTop: '1px solid #f1f5f9', padding: '16px 24px', display: 'flex', justifyContent: 'end', gap: '12px' }}>
                        <CButton onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>
                            Cancel
                        </CButton>
                        <CButton type="submit" disabled={loading} style={{ backgroundColor: '#0d48d1', color: '#fff', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            {loading ? "Processing..." : "Confirm Inbound"}
                        </CButton>
                    </CModalFooter>
                </form>
            </div>
        </CModal>
    )

}

export default InboundModal;