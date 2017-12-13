<?php 

class M_login extends CI_Model{	
	function cek_login($where){		
		$check = $this->db->get_where('users',$where);
		if ($check->num_rows() > 0) {
			if ($check->row_array()['active'] == "aktif") {
				return true;
			}else{
				return false;
			}
		} else {
			return false;
		}
	}

	function getPengguna() {
		return $this->db->get('pengguna');
	}
}