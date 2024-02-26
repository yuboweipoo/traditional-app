// PrescriptionManagement.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

const PAGE_SIZE = 10;

const PrescriptionManagement = ({ herbsData, setHerbsData }) => {
  const [prescription, setPrescription] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [realTimeSearchResults, setRealTimeSearchResults] = useState([]);
  const [newHerbName, setNewHerbName] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const [textToCopy, setTextToCopy] = useState('-');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setRealTimeSearchResults(herbsData);
  }, [herbsData]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchResults]);

  const handleHerbSearch = () => {
    const results = realTimeSearchResults.filter(herb =>
      herb.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleInputBlur = () => {
    handleHerbSearch();
  };

  const handleHerbToggle = selectedHerb => {
    const isAlreadySelected = prescription.some(item => item.herb.id === selectedHerb.id);

    if (!isAlreadySelected) {
      setPrescription(prevPrescription => [
        ...prevPrescription,
        { herb: selectedHerb, quantity: 1 },
      ]);
      setSearchQuery('');
    } else {
      setPrescription(prevPrescription => prevPrescription.filter(item => item.herb.id !== selectedHerb.id));
    }
  };

  const handleQuantityChange = (herbId, newQuantity) => {
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setPrescription(prevPrescription =>
        prevPrescription.map(item =>
          item.herb.id === herbId ? { ...item, quantity: parseInt(newQuantity, 10) } : item
        )
      );
    }
  };

  const handleGeneratePrescription = async () => {
    const result = prescription.map(
      item => `${item.herb.name}${item.quantity}g`
    ).join('、');
    const textArea = document.createElement('textarea');
    textArea.value = result;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      // await navigator.clipboard.writeText(result);
      const successful = document.execCommand('copy');
      setIsCopied(successful);
      // alert(`已生成药方：${result}，已复制到剪切板`);
    } catch (error) {
      console.error('复制到剪切板失败', error);
    }
    document.body.removeChild(textArea);
    
  };

  const handleCopyClick = () => {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      setIsCopied(successful);
    } catch (err) {
      console.error('Unable to copy text', err);
    }

    document.body.removeChild(textArea);
  };
  


  const handleAddNewHerb = () => {
    if (searchQuery.trim() !== '') {
      const isAlreadyAdded = herbsData.some(herb => herb.name.toLowerCase() === searchQuery.toLowerCase());

      if (!isAlreadyAdded) {
        const newHerb = { id: herbsData.length + 1, name: searchQuery };
        const quantityInput = prompt(`请输入 "${searchQuery}" 的药量（默认为1）：`);
        const quantity = quantityInput ? parseInt(quantityInput, 10) : 1;

        if (!isNaN(quantity) && quantity >= 1) {
          setPrescription(prevPrescription => [
            ...prevPrescription,
            { herb: newHerb, quantity: quantity },
          ]);
          setHerbsData(prevHerbsData => [...prevHerbsData, newHerb]);
          setSearchQuery('');
          alert('中草药及药量已成功添加到列表！');
        } else {
          alert('请输入有效的药量（大于等于1的整数）');
        }
      } else {
        alert('该中草药已存在，请检查输入');
      }
    } else {
      alert('请输入中草药名称');
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const generatePagination = () => {
    const pageCount = Math.ceil(searchResults.length / PAGE_SIZE);
    const ellipsisElement = <span key="ellipsis" className="ellipsis">...</span>;
    const pageElements = [];

    if (pageCount === 0) return pageElements;

    if (pageCount <= 7) {
      for (let i = 0; i < pageCount; i++) {
        pageElements.push(
          <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
            <a
              href="#!"
              className="page-link"
              onClick={(e) => handlePageChange({ selected: i }, e)}
            >
              {i + 1}
            </a>
          </li>
        );
      }
    } else {
      const startPage = Math.max(0, Math.min(currentPage - 2, pageCount - 5));
      const endPage = Math.min(pageCount, startPage + 5);

      pageElements.push(
        <li key={0} className={`page-item ${0 === currentPage ? 'active' : ''}`}>
          <a
            href="#!"
            className="page-link"
            onClick={(e) => handlePageChange({ selected: 0 }, e)}
          >
            1
          </a>
        </li>
      );

      if (startPage > 1) {
        pageElements.push(ellipsisElement);
      }

      for (let i = startPage; i < endPage; i++) {
        pageElements.push(
          <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
            <a
              href="#!"
              className="page-link"
              onClick={(e) => handlePageChange({ selected: i }, e)}
            >
              {i + 1}
            </a>
          </li>
        );
      }

      if (endPage < pageCount - 1) {
        pageElements.push(ellipsisElement);
      }

      pageElements.push(
        <li key={pageCount - 1} className={`page-item ${pageCount - 1 === currentPage ? 'active' : ''}`}>
          <a
            href="#!"
            className="page-link"
            onClick={(e) => handlePageChange({ selected: pageCount - 1 }, e)}
          >
            {pageCount}
          </a>
        </li>
      );
    }

    return pageElements;
  };

  // x
  const handleRemoveHerb = (herbId) => {
    setPrescription((prevPrescription) =>
      prevPrescription.filter((item) => item.herb.id !== herbId)
    );
  };

  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const displayedSearchResults = searchResults.slice(startIndex, endIndex);

  return (
    <div>
      <h2>开药方页面</h2>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={handleInputBlur}
          onKeyUp={handleHerbSearch}
          placeholder="搜索中草药"
        />
      </div>
      <div>
        <ul>
          {displayedSearchResults.map((herb) => (
            <li key={herb.id}>
              <label>
                <input
                  type="checkbox"
                  checked={prescription.some(
                    (item) => item.herb.id === herb.id
                  )}
                  onChange={() => handleHerbToggle(herb)}
                />
                {herb.name}
              </label>
              <div className="quantity-control">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      herb.id,
                      prescription.find((item) => item.herb.id === herb.id)
                        ?.quantity - 1 || 1
                    )
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  value={
                    prescription.find((item) => item.herb.id === herb.id)
                      ?.quantity || 1
                  }
                  onChange={(e) =>
                    handleQuantityChange(herb.id, e.target.value)
                  }
                  min={1}
                />
                <button
                  onClick={() =>
                    handleQuantityChange(
                      herb.id,
                      prescription.find((item) => item.herb.id === herb.id)
                        ?.quantity + 1 || 1
                    )
                  }
                >
                  +
                </button>
              </div>
            </li>
          ))}
          {searchQuery && displayedSearchResults.length === 0 && (
            <li>
              <span>{`未找到中草药 "${searchQuery}"`}</span>
              <button onClick={handleAddNewHerb}>添加到列表</button>
            </li>
          )}
        </ul>
      </div>
      {/* ... 分页组件 ... */}
      <div className="pagination-container">
        <ul className="pagination">
          {generatePagination()}
        </ul>
      </div>
      <div className="selected-herbs">
        <h3>已选草药及药量：</h3>
        <ul className="selected-herbs-list">
          {prescription.map((item) => (
            <li key={item.herb.id} className="selected-herb-item">
              <span>{`${item.herb.name} ${item.quantity}g`}</span>
              <span
                className="remove-herb-button"
                onClick={() => handleRemoveHerb(item.herb.id)}
              >
                x
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button onClick={handleGeneratePrescription}>一键开药方</button>
      </div>
      {isCopied && (
        <div style={{ color: 'green' }}>
          文本已复制到剪贴板！
        </div>
      )}
    </div>
  );
};

PrescriptionManagement.propTypes = {
  herbsData: PropTypes.array.isRequired,
  setHerbsData: PropTypes.func.isRequired,
};

export default PrescriptionManagement;
