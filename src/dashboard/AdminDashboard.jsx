import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CAlert,
  CBadge,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow
} from '@coreui/react'
import { CChartBar, CChartDoughnut } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilWarning,
  cilSwapHorizontal,
  cilEnvelopeOpen
} from '@coreui/icons'

import { 
  dashboardSummary, 
  getMovements, 
  getRequests 
} from '../api/api'

const AdminDashboard = () => {
  const [data, setData] = useState({
    summary: {},
    alerts: {},
    recentMovements: [],
    recentRequests: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        
        // HANYA memanggil 3 API (tanpa userActivity)
        const [dashRes, moveRes, reqRes] = await Promise.all([
          dashboardSummary(),
          getMovements({ page: 1, limit: 5 }),
          getRequests({ page: 1, limit: 5 })
        ])
        
        setData({
          summary: dashRes.data?.summary || {},
          alerts: dashRes.data?.alerts || {},
          recentMovements: moveRes.data || [],
          recentRequests: reqRes.data || []
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load Dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <CSpinner color="primary" variant="grow" className="mb-3" style={{ width: '3rem', height: '3rem' }}/>
          <h5 className="text-primary fw-bold">Loading Admin Dashboard...</h5>
        </div>
      </div>
    )
  }

  if (error) return <CAlert color="danger">{error}</CAlert>

  const { summary, alerts, recentMovements, recentRequests } = data

  return (
    <div className="dashboard-wrapper">
      {/* SUMMARY KPI CARDS (Diubah ke lg={4} agar pas 3 kolom) */}
      <CRow className="mb-4 g-4">
        {/* 1. TOTAL PRODUCTS & MASTER SUMMARY */}
        <CCol sm={6} lg={4}>
          <CCard className="h-100 border-start border-start-4 border-start-primary shadow-sm">
            <CCardBody>
              <div className="text-body-secondary small fw-semibold text-uppercase mb-1">Total Products</div>
              <div className="fs-3 fw-bold text-primary">{summary.totalProducts || 0}</div>
              <div className="small text-body-secondary mt-1">
                {summary.totalCategories || 0} Categories • {summary.totalUnits || 0} Units
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        
        {/* 2. TOTAL MOVEMENTS (DENGAN RINCIAN IN & OUT) */}
        <CCol sm={6} lg={4}>
          <CCard className="h-100 border-start border-start-4 border-start-success shadow-sm">
            <CCardBody>
              <div className="text-body-secondary small fw-semibold text-uppercase mb-1">Stock Movements</div>
              <div className="fs-3 fw-bold text-dark">{summary.totalMovements || 0} <span className="fs-6 text-muted fw-normal">Total</span></div>
              <div className="d-flex gap-2 mt-1">
                <CBadge color="success">IN: {summary.movementsIn || 0}</CBadge>
                <CBadge color="warning">OUT: {summary.movementsOut || 0}</CBadge>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* 3. SYSTEM ALERTS (PENDING REQUESTS & LOW STOCK) */}
        <CCol sm={6} lg={4}>
          <CCard className={`h-100 border-start border-start-4 shadow-sm ${(alerts.lowStockProducts > 0 || alerts.pendingRequests > 0) ? 'border-start-danger' : 'border-start-secondary'}`}>
            <CCardBody className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-body-secondary small fw-semibold text-uppercase mb-1">Action Needed</div>
                <div className="d-flex align-items-center gap-2 my-1">
                  <CBadge color="warning">{alerts.pendingRequests || 0} Pending Req</CBadge>
                  <CBadge color="danger">{alerts.lowStockProducts || 0} Low Stock</CBadge>
                </div>
                <div className="small text-body-secondary">
                  From {summary.totalRequests || 0} Total Requests
                </div>
              </div>
              {(alerts.lowStockProducts > 0 || alerts.pendingRequests > 0) && (
                <CIcon icon={cilWarning} size="xl" className="text-danger opacity-50" />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* CHARTS SECTION */}
      <CRow className="mb-4 g-4">
        <CCol md={4}>
          <CCard className="h-100 shadow-sm border-0">
            <CCardHeader className="bg-white pt-4 border-0">
              <h6 className="fw-bold mb-0">Stock Movement Ratio</h6>
            </CCardHeader>
            <CCardBody className="d-flex justify-content-center align-items-center">
              <div style={{ position: 'relative', width: '100%', height: '250px', overflow: 'hidden' }}>
                <CChartDoughnut
                  style={{ width: '100%', height: '100%' }}
                  data={{
                    labels: ['Stock IN', 'Stock OUT'],
                    datasets: [{
                      backgroundColor: ['#2eb85c', '#f9b115'],
                      data: [summary.movementsIn || 0, summary.movementsOut || 0],
                      borderWidth: 0,
                      hoverBorderWidth: 0,
                      hoverOffset: 0
                    }],
                  }}
                  options={{ 
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    cutout: '65%', 
                    plugins: { 
                      legend: { 
                        display: true,
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 20
                        }
                      }, 
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        padding: 10,
                        cornerRadius: 4,
                        displayColors: true,
                      } 
                    }
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={8}>
          <CCard className="h-100 shadow-sm border-0">
            <CCardHeader className="bg-white pt-4 border-0">
              <h6 className="fw-bold mb-0">Master Data Distribution</h6>
            </CCardHeader>
            <CCardBody>
              <div style={{ position: 'relative', width: '100%', height: '250px', overflow: 'hidden' }}>
                <CChartBar
                  style={{ width: '100%', height: '100%' }}
                  data={{
                    // Dihapus 'User' dari label dan dataset
                    labels: ['Category', 'Unit', 'Supplier', 'Customer'],
                    datasets: [{
                      label: 'Total Registered',
                      backgroundColor: '#321fdb',
                      borderRadius: 4,
                      borderWidth: 0,
                      hoverBorderWidth: 0,
                      data: [
                        summary.totalCategories || 0,
                        summary.totalUnits || 0,
                        summary.totalSuppliers || 0,
                        summary.totalCustomers || 0,
                      ],
                    }],
                  }}
                  options={{ 
                    responsive: true,
                    maintainAspectRatio: false, 
                    animation: false,
                    plugins: { 
                      legend: { display: false }, 
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        padding: 10,
                        cornerRadius: 4,
                        displayColors: true,
                      } 
                    } 
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* TABLES SECTION (Diubah menjadi 2 kolom: lg={6}) */}
      <CRow className="g-4">
        
        {/* RECENT MOVEMENTS */}
        <CCol lg={6}>
          <CCard className="h-100 shadow-sm border-0">
            <CCardHeader className="bg-white py-3 d-flex align-items-center">
              <CIcon icon={cilSwapHorizontal} className="me-2 text-primary" />
              <h6 className="fw-bold mb-0">Inbound & Outbound</h6>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable align="middle" hover responsive className="mb-0 border-top">
                <CTableBody>
                  {recentMovements.length > 0 ? recentMovements.map((mv, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell className="ps-3 py-3">
                        <div className="fw-semibold">{mv.product?.name || 'Unknown Product'}</div>
                        <div className="small text-body-secondary">{mv.referenceCode || '-'}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-end pe-3">
                        <CBadge color={mv.type === 'IN' ? 'success' : 'warning'} className="mb-1">
                          {mv.type} : {mv.quantity}
                        </CBadge>
                        <div className="small text-body-secondary">
                          {new Date(mv.createdAt).toLocaleDateString('en-US')}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  )) : (
                    <CTableRow><CTableDataCell colSpan="2" className="text-center py-4 text-muted">No movements yet</CTableDataCell></CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* RECENT REQUESTS */}
        <CCol lg={6}>
          <CCard className="h-100 shadow-sm border-0">
            <CCardHeader className="bg-white py-3 d-flex align-items-center">
              <CIcon icon={cilEnvelopeOpen} className="me-2 text-info" />
              <h6 className="fw-bold mb-0">Recent Requests</h6>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable align="middle" hover responsive className="mb-0 border-top">
                <CTableBody>
                  {recentRequests.length > 0 ? recentRequests.map((req, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell className="ps-3 py-3">
                        <div className="fw-semibold">{req.creator?.name || 'User'}</div>
                        <div className="small text-body-secondary">{req.requestItems?.length || 0} Items</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-end pe-3">
                         <CBadge 
                          color={req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'danger' : 'secondary'}
                          className="mb-1"
                        >
                          {req.status}
                        </CBadge>
                        <div className="small text-body-secondary">
                          {new Date(req.createdAt).toLocaleDateString('en-US')}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  )) : (
                    <CTableRow><CTableDataCell colSpan="2" className="text-center py-4 text-muted">No requests yet</CTableDataCell></CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

      </CRow>
    </div>
  )
}

export default AdminDashboard