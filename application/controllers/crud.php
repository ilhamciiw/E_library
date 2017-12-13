<?php 


class Crud extends CI_Controller{

	function __construct(){
		parent::__construct();		
		$this->load->model('m_data');
		$this->load->helper('url');

	}

	function index(){
		$data['user'] = $this->m_data->tampil_data()->result();
		$this->load->view('v_tampil',$data);
	}

	function tambah(){
		$this->load->view('v_input');
	}

	
	function tambah_aksi(){
		$nama = $this->input->post('nama');
		$nomor_induk = $this->input->post('nomor_induk');
		$tahun_masuk = $this->input->post('tahun_masuk');
 		$username = $this->input->post('username');
		$password = $this->input->post('password');

		$data = array(
			'nama' => $nama,
			'nomor_induk' => $nomor_induk,
			'tahun_masuk' => $tahun_masuk,
			'username' => $username,
			'password' => $password
			);
		$this->m_data->input_data($data,'user');
		redirect(base_url().'admin/list_user');
	}

	
}