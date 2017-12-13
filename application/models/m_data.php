<?php 

class M_data extends CI_Model{
	function tampil_data(){
		return $this->db->get('user');
	}

	function input_data($data,$table){
		$this->db->insert($table,$data);
	}

	public function getEmailByUsername($username)
	{
		return $this->db->get_where('users', array('username'=>$username))->row_array()['email'];
	}

	function hapus_data($username,$user){
	$this->db->where($username);
	$this->db->delete($user);
	}
}