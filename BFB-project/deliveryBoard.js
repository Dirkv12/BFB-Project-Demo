// deliveryBoard.js
// Renders a Bootstrap table for deliveries with sortable columns and an edit modal
(function(){
    if (!window.BFB_DELIVERIES) window.BFB_DELIVERIES = [];

    const statusLabel = {
        on_time: { text: 'On time', class: 'bg-success' },
        delayed: { text: 'Delayed', class: 'bg-warning text-dark' },
        exception: { text: 'Exception', class: 'bg-danger' }
    };

    function formatTime(iso) {
        const d = new Date(iso);
        return d.toLocaleString();
    }

    function renderRow(delivery) {
        const tr = document.createElement('tr');
        tr.dataset.id = delivery.id;

        const etaDisplay = delivery.eta ? formatTime(delivery.eta) : '';
        const status = statusLabel[delivery.status] || { text: delivery.status, class: 'bg-secondary' };

        tr.innerHTML = `
            <td>${delivery.route}</td>
            <td>${delivery.vehicle}</td>
            <td data-value="${delivery.eta || ''}">${etaDisplay}</td>
            <td><span class="badge ${status.class}">${status.text}</span></td>
            <td><button class="btn btn-sm btn-outline-primary edit-btn">Update</button></td>
        `;
        return tr;
    }

    function renderTable(data) {
        const tbody = document.querySelector('#deliveryTable tbody');
        tbody.innerHTML = '';
        data.forEach(d => tbody.appendChild(renderRow(d)));
        // attach edit handlers
        tbody.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', onEditClick));
    }

    function onEditClick(e) {
        const tr = e.target.closest('tr');
        const id = tr.dataset.id;
        const delivery = window.BFB_DELIVERIES.find(x => x.id === id);
        if (!delivery) return;
        showEditModal(delivery);
    }

    // Simple client-side sort
    function sortBy(key, ascending = true) {
        window.BFB_DELIVERIES.sort((a,b) => {
            const va = a[key] || '';
            const vb = b[key] || '';
            if (key === 'eta') {
                return ascending ? new Date(va) - new Date(vb) : new Date(vb) - new Date(va);
            }
            return ascending ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
        });
        renderTable(window.BFB_DELIVERIES);
    }

    function addSortingHandlers() {
        document.querySelectorAll('#deliveryTable thead th.sortable').forEach(th => {
            let asc = true;
            th.style.cursor = 'pointer';
            th.addEventListener('click', () => {
                const key = th.dataset.key;
                sortBy(key, asc);
                asc = !asc;
            });
        });
    }

    // Modal implementation (uses Bootstrap modal markup injected once)
    function createModal() {
        if (document.getElementById('deliveryEditModal')) return;
        const tpl = document.createElement('div');
        tpl.innerHTML = `
        <div class="modal fade" id="deliveryEditModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <form class="modal-content" id="deliveryEditForm" novalidate>
              <div class="modal-header">
                <h5 class="modal-title">Update Delivery</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <input type="hidden" id="edit-id" />
                <div class="mb-3">
                  <label class="form-label" for="edit-status">Status</label>
                  <select id="edit-status" class="form-select" required>
                    <option value="">Choose...</option>
                    <option value="on_time">On time</option>
                    <option value="delayed">Delayed</option>
                    <option value="exception">Exception</option>
                  </select>
                  <div class="invalid-feedback">Select a status.</div>
                </div>
                <div class="mb-3 d-none" id="exceptionGroup">
                  <label class="form-label" for="edit-exception">Exception details</label>
                  <textarea id="edit-exception" class="form-control" rows="3"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label" for="edit-eta">ETA</label>
                  <input id="edit-eta" type="datetime-local" class="form-control" />
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
        `;
        document.body.appendChild(tpl);

        const form = document.getElementById('deliveryEditForm');
        const status = document.getElementById('edit-status');
        const exGroup = document.getElementById('exceptionGroup');
        status.addEventListener('change', () => {
            exGroup.classList.toggle('d-none', status.value !== 'exception');
        });

        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }
            const id = document.getElementById('edit-id').value;
            const delivery = window.BFB_DELIVERIES.find(x => x.id === id);
            if (!delivery) return;
            delivery.status = document.getElementById('edit-status').value;
            delivery.exception = document.getElementById('edit-exception').value;
            const etaVal = document.getElementById('edit-eta').value;
            delivery.eta = etaVal ? new Date(etaVal).toISOString() : null;
            renderTable(window.BFB_DELIVERIES);
            const modal = bootstrap.Modal.getInstance(document.getElementById('deliveryEditModal'));
            modal.hide();
        });
    }

    function showEditModal(delivery) {
        createModal();
        document.getElementById('edit-id').value = delivery.id;
        document.getElementById('edit-status').value = delivery.status || '';
        document.getElementById('edit-exception').value = delivery.exception || '';
        const etaInput = document.getElementById('edit-eta');
        if (delivery.eta) {
            const dt = new Date(delivery.eta);
            // format to yyyy-MM-ddTHH:mm for input
            const pad = n => String(n).padStart(2,'0');
            const local = new Date(dt.getTime() - dt.getTimezoneOffset()*60000);
            etaInput.value = local.toISOString().slice(0,16);
        } else etaInput.value = '';
        const modalEl = document.getElementById('deliveryEditModal');
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }

    // Init
    function init() {
        addSortingHandlers();
        renderTable(window.BFB_DELIVERIES);
    }

    // Expose init on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', init);
})();
