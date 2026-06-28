(()=>{
  const url='https://chgaizkppjanrdjvohee.supabase.co';
  const key='sb_publishable_maou1nRJdaC1061jZX89fQ_gB3856Zc';
  const rows=document.getElementById('rankingRows');
  const status=document.getElementById('rankingStatus');
  const refresh=document.getElementById('refreshRanking');
  async function load(){
    refresh.disabled=true;status.textContent='최신 랭킹을 불러오는 중입니다.';
    try{
      const response=await fetch(`${url}/rest/v1/rankings?select=nickname,score,level,created_at&order=score.desc,created_at.asc&limit=100`,{headers:{apikey:key}});
      if(!response.ok)throw new Error('ranking unavailable');
      const data=await response.json();
      rows.replaceChildren();
      if(!data.length){rows.innerHTML='<tr><td colspan="5" class="rank-empty">아직 등록된 기록이 없습니다.</td></tr>'}
      data.forEach((record,index)=>{
        const tr=document.createElement('tr');
        const values=[index+1,record.nickname,Number(record.score).toLocaleString('ko-KR'),record.level,new Date(record.created_at).toLocaleDateString('ko-KR')];
        values.forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.appendChild(td)});rows.appendChild(tr);
      });
      status.textContent=`총 ${data.length}개 기록 · ${new Date().toLocaleTimeString('ko-KR')} 갱신`;
    }catch(error){rows.innerHTML='<tr><td colspan="5" class="rank-empty">랭킹을 불러오지 못했습니다.</td></tr>';status.textContent='잠시 후 다시 시도해 주세요.'}
    finally{refresh.disabled=false}
  }
  refresh.addEventListener('click',load);load();setInterval(load,30000);
})();
