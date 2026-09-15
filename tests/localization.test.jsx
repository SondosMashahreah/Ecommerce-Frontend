import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import i18n from '../src/i18n';
import ar from '../src/i18n/ar.json';
import catalog from '../src/i18n/catalog.ar.json';
import { localizedProductName, localizedProductDescription } from '../src/i18n/productContent';
import LocalizedCatalogInput from '../src/components/LocalizedCatalogInput/LocalizedCatalogInput';
import AdminProductEdit from '../src/pages/Admin/Products/AdminProductEdit';
import * as api from '../src/services/api';

vi.mock('../src/services/api',()=>({getAdminProduct:vi.fn(),updateAdminProduct:vi.fn(),uploadAdminProductImage:vi.fn(),updateAdminProductItem:vi.fn(),deleteAdminProductItem:vi.fn(),getCategories:vi.fn()}));
const product={id:1,name:'Apple iPhone 18 Pro Max',description:'Apple smartphone',category:'Smartphones',price:1399,image_path:null,items:[]};

beforeEach(async()=>{
  await i18n.changeLanguage('ar');
  vi.spyOn(window,'alert').mockImplementation(()=>{});
  api.getAdminProduct.mockResolvedValue({...product});api.getCategories.mockResolvedValue(['Smartphones']);api.updateAdminProduct.mockResolvedValue(product);
});
afterEach(()=>{cleanup();vi.clearAllMocks();vi.restoreAllMocks();});

describe('Arabic presentation without data changes',()=>{
  it('has no untranslated Latin UI terms in Arabic resources',()=>{
    for(const value of Object.values(ar)) expect(value.replace(/\{\{.*?\}\}/g,'')).not.toMatch(/[A-Za-z]/);
    for(const value of Object.values(catalog)) expect(value).not.toMatch(/[A-Za-z]/);
  });
  it('translates every current catalog entry completely and leaves English unchanged',()=>{
    for(const [source,arabic] of Object.entries(catalog)){
      expect(localizedProductName(source,'ar')).toBe(arabic);
      expect(localizedProductDescription(source,'ar')).toBe(arabic);
      expect(localizedProductName(source,'en')).toBe(source);
    }
  });
  it('does not emit a data edit when an Arabic field is only focused and blurred',async()=>{
    const change=vi.fn();const user=userEvent.setup();
    render(<LocalizedCatalogInput aria-label="اسم المنتج" value={product.name} onChange={change}/>);
    expect(screen.getByLabelText('اسم المنتج').value).toBe('آبل آيفون ١٨ برو ماكس');
    await user.click(screen.getByLabelText('اسم المنتج'));await user.tab();
    expect(change).not.toHaveBeenCalled();
  });
  it('maps a translated category selection back to the original category',async()=>{
    const change=vi.fn();const user=userEvent.setup();
    render(<LocalizedCatalogInput aria-label="الفئة" name="category" value="" choices={['Smartphones']} onChange={change}/>);
    await user.type(screen.getByLabelText('الفئة'),'هواتف ذكية');
    expect(change.mock.lastCall[0].target).toEqual({name:'category',value:'Smartphones'});
  });
  it('saves original names, descriptions and category when only price is edited in Arabic',async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter initialEntries={['/admin/products/1']}><Routes><Route path="/admin/products/:id" element={<AdminProductEdit/>}/></Routes></MemoryRouter>);
    const name=await screen.findByLabelText(i18n.t('Name'));
    expect(name.value).toBe('آبل آيفون ١٨ برو ماكس');
    expect(screen.getByLabelText(i18n.t('Category'), { exact: false }).value).toBe('هواتف ذكية');
    const price=screen.getByLabelText(i18n.t('Price'));await user.clear(price);await user.type(price,'1400');
    await user.click(screen.getByRole('button',{name:i18n.t('Save Product')}));
    await waitFor(()=>expect(api.updateAdminProduct).toHaveBeenCalledWith(1,{name:product.name,description:product.description,category:'Smartphones',price:1400}));
  });
});
