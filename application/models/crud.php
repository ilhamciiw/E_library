<?php
class Crud extends CI_Model{
	public function tampil_alldata($table)
	{
		return $this->db->get($table)->result();
	}

	public function tampil_data($table,$where)
	{
		return $this->db->get_where($table,$where)->result();
	}

	public function insert($table,$data)
	{
		$insert = $this->db->insert($table,$data);
		if ($insert) {
			return true;
		} else {
			return false;
		}
		
	}

	public function update($table, $where, $data)
	{
		$this->db->where($where);
		return $this->db->update($table,$data);
	}

	public function delete($table, $where)
	{
		$this->db->where($where);
		return $this->db->delete();
	}
}